---
question: "How do you design an offline-first architecture? (single source of truth, NetworkBoundResource)"
topic: architecture
difficulty: senior
tags: ["offline-first", "caching", "single-source-of-truth", "repository"]
---

The core principle: **the local database is the single source of truth**. The UI **always reads from the database**; the network only **updates** the database. The app works offline by default, and network is an enhancement.

```
UI ──observes──▶ Room (source of truth) ◀──writes── Repository ◀──fetches── Network
```

**The classic flow (NetworkBoundResource pattern):**
1. UI observes a **Room `Flow`** → shows cached data immediately (even offline).
2. Repository decides whether to refresh (stale? forced?).
3. If refreshing, fetch from network → **write into Room**.
4. Room emits the new data → UI updates automatically. The network result never goes straight to the UI.

```kotlin
fun observeArticles(): Flow<List<Article>> = flow {
    emitAll(dao.observeArticles())           // 1. always from DB
}.onStart {
    runCatching { val fresh = api.getArticles(); dao.upsertAll(fresh.map { it.toEntity() }) }
        .onFailure { /* offline: UI still has cached data */ }   // 2-4
}
```

**Key design decisions interviewers probe:**
- **Source of truth = DB**, not the network response. This is what makes it consistent and offline-capable.
- **Freshness policy** — cache-then-network, TTL-based invalidation, or pull-to-refresh forcing a fetch.
- **Writes / sync** — queue local mutations (likes, edits) with a status flag, do **optimistic UI**, and sync to the server when online (often via **WorkManager** with a network constraint); reconcile conflicts (last-write-wins, version vectors, or server authority).
- **Pagination** — **Paging 3 + `RemoteMediator`** implements offline-first paging: pages are written to Room, the UI pages from Room.
- **Conflict resolution** and **partial failure** handling are the senior-level details.

**Why it's better than fetch-on-demand:** instant loads from cache, resilience to flaky networks, consistent UI, and less redundant fetching.

**Soundbite:** "Offline-first = the database is the single source of truth; UI observes the DB, network writes to the DB (NetworkBoundResource). Add a freshness policy, queue+sync local writes (WorkManager) with optimistic UI and conflict resolution, and page from Room via RemoteMediator."
