---
title: Offline synchronization and mobile source-of-truth design
description: Design mobile features around unreliable transport, durable intent, retries, conflicts, and user-visible truth.
level: senior
order: 2
duration: 60 min
quizHref: /practice/?test=system-design-test
quizLabel: Take the system design quiz
---

Mobile system design begins with constraints that a server cannot control: networks change quality or disappear, process lifetime is uncertain, storage is finite, radio use has a cost, and a user may leave during any operation. An offline-capable design must therefore distinguish what a user has asked the device to do from what the server has durably acknowledged.

This chapter establishes a vocabulary for that distinction. It treats local intent, queued work, attempted transport, server acknowledgement, conflict resolution, and visible state as separate concepts. A design is credible only when it names the behavior at each of those boundaries.

## Learning goals

- Separate local intent from remote acknowledgement.
- Design idempotent writes, outboxes, and an explicit conflict policy.
- Choose among fetch, push, periodic, and push-triggered synchronization deliberately.
- Define product truth that the interface can render consistently.
- Structure a time-bounded Android system-design answer around the riskiest data path.

## Separate local intent from remote acknowledgement

For an offline-capable write:

1. Persist the user’s change **and** an outbox operation in one local transaction.
2. UI reads local state immediately (optimistic or pending).
3. A worker drains the outbox under network constraints.
4. Server responses update local rows and clear/fail operations.

```kotlin
suspend fun updateNote(note: Note) = db.withTransaction {
    noteDao.upsert(note.copy(syncState = SyncState.PENDING))
    outboxDao.insert(
        OutboxOp(
            operationId = Uuid.random().toString(),
            type = OpType.UPDATE_NOTE,
            entityId = note.id,
            payload = note.toPayload(),
            createdAt = clock.now(),
        )
    )
}
```

### Why the operation ID matters

Networks fail after the server applied a write but before the client saw the response. A client retry without idempotency creates duplicates. An **operation ID** (or idempotency key) lets the server recognize a retry and return the previous result.

```http
POST /notes/123
Idempotency-Key: 6b1e0c2a-...
```

## Define product truth

Before drawing boxes, write sentences like:

- “The note list shows **last known local state**, with pending badges on unsynced edits.”
- “If two devices edit the same note, **last-writer-wins by server timestamp**” (or CRDT, or manual merge - pick one).
- “Deletes are tombstones until sync completes.”
- “Auth expiry pauses the outbox and routes the user to re-login without losing queued ops.”

If product truth is vague, engineers invent three competing truths in UI, cache, and server.

## Sync patterns

| Pattern | Mechanism | Good for |
|---------|-----------|----------|
| Read-through cache | Show DB; refresh from network | Feeds, catalogs |
| Outbox writes | Queue mutations | Notes, drafts, likes |
| Delta sync | `updatedSince` / version tokens | Large collections |
| Full snapshot | Replace partition | Small rare datasets |
| Push-triggered | FCM → fetch | Chat, breaking updates |
| Periodic | WorkManager | Non-urgent reconciliation |

![Offline-first read and refresh flow](/diagrams/offline-first.svg)

### Pagination and sync

Cursor/page tokens are server read concerns; local DB remains the UI source of truth. Avoid “in-memory only” pages if offline matters.

```kotlin
// Remote page → upsert into Room → PagingSource reads Room
suspend fun loadNext(pageToken: String?) {
    val response = api.list(pageToken)
    dao.upsertAll(response.items.map { it.toEntity() })
    remoteKeysDao.save(response.nextToken)
}
```

## Conflicts

Conflict policy is a product decision with technical teeth:

| Strategy | Meaning | UX impact |
|----------|---------|-----------|
| Last-writer-wins | Highest timestamp/version wins | Simple; silent data loss possible |
| Server authoritative | Client always rebases | Need clear “your edit was overwritten” |
| Field merge | Merge non-overlapping fields | Complex |
| CRDT / OT | Convergent structures | Heavy; great for collaborative text |
| Manual resolve | User picks | Honest; more UI |

Interviewers listen for you **naming the conflict class** for the domain (banking ≠ notes ≠ collaborative docs).

## Retries, backoff, and ordering

- Retry **transient** failures (timeouts, 502) with exponential backoff + jitter.
- Do **not** blindly retry non-idempotent POSTs without keys.
- Preserve **per-entity ordering** if operation order matters (create before update).
- Use WorkManager constraints: `NetworkType.CONNECTED`, battery, etc.

```kotlin
val request = OneTimeWorkRequestBuilder<OutboxWorker>()
    .setConstraints(
        Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build()
    )
    .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, 30, TimeUnit.SECONDS)
    .build()
```

## Security and trust on device

Offline-first does not mean “trust the client forever.”

- Authenticate every sync call; refresh tokens carefully (single-flight refresh).
- Store secrets in **Keystore-backed** storage; not plain SharedPreferences.
- Validate server data before upsert (ignore impossible states).
- Consider encrypted DB if threat model requires it (performance cost).

## Resource constraints unique to mobile

Call these out unprompted in designs:

- **Battery & radios** - batch transfers; avoid wakeups.
- **Storage** - bound caches; eviction policy; user-visible media sizes.
- **Process death** - outbox on disk, not memory.
- **Bandwidth** - delta sync, compression, image sizes.
- **OS background limits** - WorkManager vs forbidden background services.

## A skeleton system-design answer (notes app)

1. **Requirements** - offline edit, multi-device, eventual consistency, conflict policy LWW, auth.
2. **Client architecture** - single Activity, feature module, Room source of truth, outbox, WorkManager, repository.
3. **API** - CRUD + idempotency keys + `updatedSince` feed; 401 handling.
4. **Data model** - `notes`, `outbox`, `sync_metadata`; tombstones.
5. **Sync algorithm** - push outbox; pull deltas; apply transactions; surface errors.
6. **Edge cases** - clock skew, partial failure, large attachments (upload session), logout with pending ops.
7. **Observability** - sync success rate, outbox age, conflict counts.
8. **Trade-offs** - LWW simplicity vs possible silent overwrite; why not full CRDT yet.

## Caching layers

![Mobile cache layers and their ownership](/diagrams/mobile-cache-layers.svg)

Each layer needs size limits and invalidation rules. “Cache everything forever” is not a strategy.

## Common pitfalls

1. Optimistic UI without durable outbox - data vanishes on process death.
2. Duplicate creates from naive retries.
3. Using only in-memory state for multi-screen flows that must survive.
4. Ignoring auth expiry mid-sync.
5. Designing server-only truth while product promised airplane-mode editing.

## Examination prompts

- “Design offline notes / queue / chat / photo backup.”
- “What if the response is lost after success?”
- “How do two devices conflict?”
- “What runs when the app is backgrounded?”
- “How do you show sync status without lying?”
- “Where is the source of truth?”

## Practice checklist

1. Write an outbox schema and drain algorithm for a single entity type.
2. List ten failure modes for “edit note offline, open on second phone.”
3. Practice a 5-minute whiteboard of delta sync + pagination.
4. Define metrics you would alert on for sync health.

## What you should be able to explain

- Local intent vs remote ack with idempotency.
- Outbox + worker pattern.
- Conflict policy as product + engineering.
- Mobile constraints in system design.
- Structured interview delivery.

Next: **Reliability, observability, and technical decisions** - shipping and living with the system you designed.
