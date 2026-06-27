---
question: "How does Paging 3 fit into app architecture? (PagingSource, RemoteMediator)"
topic: architecture
difficulty: senior
tags: ["paging", "architecture", "offline-first"]
---

Paging 3 is the Jetpack solution for **incrementally loading large lists**, integrated across all three layers.

**The pieces:**
- **`PagingSource`** — loads one page from a **single** source (e.g. network only). Defines how to fetch a page and the keys for next/prev.
- **`RemoteMediator`** — coordinates **network + database** for offline-first paging: it fetches pages from the network and **writes them into Room**, while a Room-backed `PagingSource` serves the UI from the DB.
- **`Pager`** — config (page size, prefetch) that produces a `Flow<PagingData<T>>`.
- **`PagingData`** — a stream of paged items the UI consumes.

**Layered flow (network + DB, the recommended setup):**
```
UI (LazyColumn / PagingDataAdapter)
   ▲  Flow<PagingData>
ViewModel:  Pager(config, remoteMediator) { db.dao().pagingSource() }
                                   │ writes pages
Data:   RemoteMediator ── fetches ──▶ Network,  ── stores ──▶ Room (source of truth)
```

```kotlin
val items: Flow<PagingData<Article>> = Pager(
    config = PagingConfig(pageSize = 20),
    remoteMediator = ArticleRemoteMediator(api, db),
) { db.articleDao().pagingSource() }
    .flow
    .cachedIn(viewModelScope)     // survive config changes
```

**What Paging handles for you:** page requests on scroll, **prefetch distance**, **deduplication**, **placeholders**, retries, and exposing **`LoadState`** (loading/error for refresh/append/prepend) so the UI can show spinners/retry footers. UI side: `collectAsLazyPagingItems()` (Compose) or `PagingDataAdapter` + DiffUtil (Views).

**Why architecturally clean:**
- **Single source of truth** — with `RemoteMediator`, the DB is the truth; the UI always pages from Room → **offline-first** for free.
- **`cachedIn(scope)`** keeps paged data across recreation so scroll position/data isn't lost on rotation.
- Each layer keeps its role: data fetches/stores, ViewModel configures the Pager, UI renders `PagingData`.

**Soundbite:** "Paging 3 spans the layers: a `RemoteMediator` fetches network pages into Room (single source of truth), a Room `PagingSource` feeds the UI, and the ViewModel exposes `Flow<PagingData>` (`cachedIn`). You get offline-first paging with load states, placeholders, and prefetch handled for you."
