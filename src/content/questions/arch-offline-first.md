---
question: "How do you design an app that works offline?"
topic: architecture
difficulty: mid
order: 100
starred: true
section: "Data and offline"
tags: ["offline-first", "caching", "single-source-of-truth", "repository"]
---

For data that must work offline, make a local source such as Room the **single
source of truth**. The UI observes local data. Network work updates that source
instead of returning a second competing copy directly to the screen.

![Offline-first flow where UI observes Room and the repository refreshes it from the network](/diagrams/offline-first.svg)

**A common read flow:**
1. UI observes a **Room `Flow`** and shows cached data immediately.
2. Repository decides whether to refresh (stale? forced?).
3. If refreshing, fetch from network → **write into Room**.
4. Room emits the new data and the UI updates automatically.

```kotlin
fun observeArticles(): Flow<List<Article>> =
    dao.observeArticles().map { rows -> rows.map(ArticleEntity::toModel) }

suspend fun refreshArticles() {
    try {
        val fresh = api.getArticles()
        db.withTransaction { dao.replaceAll(fresh.map(ArticleDto::toEntity)) }
    } catch (e: IOException) {
        // Keep cached data visible and expose refresh status separately.
    }
}
```

**Key design decisions interviewers probe:**
- **Source of truth** - choose it per repository. Room is the usual choice for
  offline-capable structured data.
- **Freshness policy** - cache-then-network, TTL-based invalidation, or pull-to-refresh forcing a fetch.
- **Writes and sync** - commit local mutations and an outbox entry atomically,
  update the UI optimistically, then sync durable work. Use WorkManager when the
  work must survive the process. Define idempotency and conflict handling.
- **Pagination** - **Paging 3 + `RemoteMediator`** implements offline-first paging: pages are written to Room, the UI pages from Room.
- **Cancellation and errors** - never turn `CancellationException` into a normal
  failure. Catch expected I/O errors narrowly and expose cached-data plus refresh
  status separately.
- **Conflict resolution, deletion tombstones, schema migration, and partial
  failure** are the senior details.

The trade-off is additional schema, sync, and conflict complexity. Use this
design when offline access, fast startup, or resilient writes justify that cost.
