---
title: Persistence, HTTP, caching, and Paging
description: Build a data flow that remains correct through refresh, pagination, cache invalidation, duplicate work, and credential changes.
level: mid
order: 5
duration: 75 min
quizHref: /practice/?test=system-design-test
quizLabel: Take the system design quiz
---

At production scale, “call the API and show the response” is not an architecture. A data feature needs an explicit source of truth, freshness policy, concurrency rule, pagination key strategy, transaction boundary, and user-visible response to failure. Without those decisions, refreshes race, list items duplicate, and the interface tells conflicting stories about the same data.

This chapter follows data across the local database and a remote HTTP service. The central design question is not which library performs a request. It is which representation the UI observes, how it is updated atomically, and how it remains coherent when the request is late, repeated, rejected, or only partially complete.

## Learning goals

- Design a repository around one explicit source of truth.
- Coordinate remote refresh and local observation without duplicating screen state.
- Use Room transactions for atomic cache updates.
- Explain Paging 3, load states, keys, and `RemoteMediator`.
- Make retries safe through idempotence and request identity.

## Start with the user-visible contract

Before choosing APIs, write the behavior:

- Existing content appears immediately from disk.
- Refresh can run without replacing content with a blank spinner.
- A refresh failure preserves stale content and exposes retry.
- Empty means a successful query with no items, not "not loaded yet."
- A user mutation is visible immediately and reconciles with the server.

This contract suggests state richer than `Loading`, `Success`, and `Error`:

```kotlin
data class FeedUiState(
    val items: List<ArticleUi> = emptyList(),
    val initialLoad: LoadStatus = LoadStatus.Loading,
    val refresh: LoadStatus = LoadStatus.Idle,
    val isStale: Boolean = false,
)

sealed interface LoadStatus {
    data object Idle : LoadStatus
    data object Loading : LoadStatus
    data class Failed(val message: String, val retryable: Boolean) : LoadStatus
}
```

## Local source of truth

In an offline-capable feature, UI normally observes the database. Network refresh writes to that database. The UI does not race a database stream against a separate network result.

![Local source of truth data flow](/diagrams/local-source-of-truth.svg)

```kotlin
class FeedRepository(
    private val api: FeedApi,
    private val db: AppDatabase,
    private val articleDao: ArticleDao,
) {
    fun observeFeed(): Flow<List<Article>> =
        articleDao.observeFeed().map { rows -> rows.map(ArticleEntity::toDomain) }

    suspend fun refresh() {
        val response = api.feed()
        db.withTransaction {
            articleDao.deleteFeedMembership()
            articleDao.upsertArticles(response.items.map(ArticleDto::toEntity))
            articleDao.insertFeedMembership(response.items.mapIndexed(::toMembership))
        }
    }
}
```

The transaction ensures observers do not see a momentarily empty or half-updated feed.

### One table is not always enough

An article can appear in multiple feeds. Deleting articles that disappear from one response may corrupt saved items or other feeds. Separate normalized content from feed membership:

```text
articles(id, title, body, updated_at)
feeds(id, name, next_cursor, refreshed_at)
feed_entries(feed_id, article_id, position)
```

This is a product-modeling decision, not Room ceremony.

## Freshness is policy

Store refresh metadata separately from content and define the clock:

```kotlin
suspend fun refreshIfStale(force: Boolean = false) {
    val lastRefresh = metadataDao.lastRefresh(FEED_KEY)
    val fresh = lastRefresh != null &&
        clock.instant() - lastRefresh < 15.minutes

    if (force || !fresh) refresh()
}
```

Questions to answer:

- Is freshness per user, query, locale, or account?
- Does manual refresh bypass the threshold?
- Can stale content remain visible during failure?
- Does a mutation invalidate related lists?
- Which clock is used in tests?

Avoid using wall-clock timestamps to order client events when the server owns order. Device clocks can be wrong.

## Concurrency and duplicate refreshes

Two collectors or retry taps can start duplicate work. Decide whether to cancel, join, serialize, or allow it.

```kotlin
private val refreshMutex = Mutex()

suspend fun refresh() = refreshMutex.withLock {
    val response = api.feed()
    database.withTransaction {
        applyFeed(response)
    }
}
```

A mutex prevents overlapping work inside one process. It does not provide cross-device or server idempotence.

For search, `flatMapLatest` often matches the contract because a newer query makes the previous result irrelevant. For a payment submission, cancellation does not necessarily cancel the server operation, so request identity and reconciliation matter more.

## HTTP semantics matter

Use method semantics intentionally:

- `GET` should be safe and is generally idempotent.
- `PUT` replaces a known resource and is generally idempotent.
- `DELETE` is idempotent in intended effect even if later status codes differ.
- `POST` is not inherently idempotent.

For a retryable `POST`, generate an idempotency key or operation ID and have the server deduplicate the operation:

```kotlin
data class PendingUpload(
    val operationId: String,
    val localUri: String,
    val state: UploadState,
    val attempt: Int,
)
```

A socket timeout after sending bytes means the outcome is unknown. The server may have committed the request even though the client did not receive the response.

## Conditional requests and validation

HTTP caching can avoid full transfers:

- Server returns `ETag` with a representation.
- Client later sends `If-None-Match`.
- Server returns `304 Not Modified` when the representation is unchanged.

OkHttp has an HTTP cache, but application-level Room storage and HTTP response caching solve different problems. Room provides queryable product data and offline behavior. HTTP cache reuses protocol responses according to cache headers.

## Paging 3 mental model

Paging 3 loads chunks as the UI approaches unloaded content.

![Paging 3 architecture with RemoteMediator and Room](/diagrams/paging-architecture.svg)

| Piece | Responsibility |
|---|---|
| `PagingSource<Key, Value>` | Load one page from a source and return adjacent keys |
| `Pager` | Builds a cold `Flow<PagingData<Value>>` |
| `PagingDataAdapter` / lazy paging items | Presents items and diffs generations |
| `LoadState` | Reports refresh, prepend, and append state |
| `RemoteMediator` | Coordinates network pages into a local database |

```kotlin
fun pagedFeed(): Flow<PagingData<Article>> = Pager(
    config = PagingConfig(
        pageSize = 30,
        prefetchDistance = 8,
        enablePlaceholders = false,
    ),
    remoteMediator = FeedRemoteMediator(api, db),
    pagingSourceFactory = { articleDao.pagingSource() },
).flow.map { pagingData -> pagingData.map(ArticleEntity::toDomain) }
```

Cache the resulting stream in `viewModelScope` with `cachedIn(viewModelScope)` so configuration change does not rebuild all loaded transformations unnecessarily.

## Keys: offset, page number, and cursor

- **Offset:** simple, but insertions before the offset can cause duplicates or gaps.
- **Page number:** similar weakness and ties the client to server page sizing.
- **Cursor:** opaque server position, usually safer for changing ordered data.

Do not calculate the next cursor from list size unless the API explicitly defines it that way. Store opaque remote keys supplied by the server.

## `RemoteMediator` transaction boundaries

A mediator's `load()` receives `REFRESH`, `PREPEND`, or `APPEND`. It fetches a page, then writes items and remote keys atomically.

```kotlin
override suspend fun load(
    loadType: LoadType,
    state: PagingState<Int, ArticleEntity>,
): MediatorResult {
    return try {
        val cursor = resolveCursor(loadType, state)
        val page = api.feed(cursor)

        db.withTransaction {
            if (loadType == LoadType.REFRESH) clearFeedAndKeys()
            articleDao.upsertAll(page.items.map(ArticleDto::toEntity))
            remoteKeyDao.insert(RemoteKey(FEED, page.nextCursor))
        }
        MediatorResult.Success(endOfPaginationReached = page.nextCursor == null)
    } catch (error: IOException) {
        MediatorResult.Error(error)
    } catch (error: HttpException) {
        MediatorResult.Error(error)
    }
}
```

The exact key strategy depends on the API and query. A remote key must be scoped to inputs such as account, query, sort order, and filters.

## Load states are separate

Paging exposes `refresh`, `prepend`, and `append` load states. A first-page failure should occupy the main content region. An append failure should usually preserve existing content and show an inline retry affordance.

Do not replace an entire populated list with a full-screen spinner during append.

## Authenticator boundaries

OkHttp interceptors can attach authentication headers. An `Authenticator` can react to a 401 challenge and obtain a new credential. Token refresh needs serialization so several failed requests do not all refresh simultaneously.

Important boundaries:

- Prevent infinite retry if refreshed credentials are also rejected.
- Do not refresh on every 403. It commonly means the authenticated user lacks permission.
- Avoid holding an OkHttp dispatcher thread indefinitely.
- Clear account-scoped data when authentication becomes irrecoverable.
- Redact credentials from network logs.

## Error ownership

The data layer should preserve enough detail for policy without leaking transport types everywhere:

```kotlin
sealed interface DataFailure {
    data object Offline : DataFailure
    data object Unauthorized : DataFailure
    data class RateLimited(val retryAfter: Duration?) : DataFailure
    data class Server(val status: Int) : DataFailure
    data class InvalidPayload(val cause: Throwable) : DataFailure
}
```

The ViewModel maps these to actions and copy. The repository should not decide whether the screen shows a Snackbar or dialog.

## Common pitfalls

1. Racing network state against database state in the UI.
2. Clearing a database outside the transaction that inserts replacement data.
3. Using list size as a cursor without an API guarantee.
4. Treating all 4xx responses as retryable.
5. Retrying non-idempotent requests without an operation key.
6. Showing a full-screen loader for an append.
7. Sharing remote keys across different filters or accounts.
8. Refreshing tokens independently for every concurrent 401.

## Examination prompts

- "What is the source of truth?"
- "How do you show cached data while refreshing?"
- "Why put delete and insert in one transaction?"
- "Cursor vs offset pagination?"
- "What does `RemoteMediator` do?"
- "How do you make a POST retry-safe?"
- "How do you prevent a token-refresh stampede?"

## Practice checklist

1. Draw a feed data path and label its only source of UI truth.
2. Implement stale-while-refresh behavior without blanking existing items.
3. Write a `RemoteMediator` test for refresh, append, end-of-pagination, and failure.
4. Simulate a timeout after the server commits a mutation and reconcile by operation ID.
5. Test two concurrent 401 responses with only one token refresh.

## What you should be able to explain

- Local source of truth and atomic refresh.
- Explicit freshness and concurrency policy.
- Paging keys, load states, and `RemoteMediator`.
- Unknown mutation outcomes and idempotent retry.

Next: **background work and notifications**, where data operations must continue under system scheduling limits.
