---
question: "What caching strategies would you use in an Android app?"
topic: architecture
difficulty: senior
tags: ["caching", "performance", "data-layer"]
---

Caching is layered; pick per data type and freshness need.

**Cache tiers (fastest → most durable):**
- **In-memory** — a `MutableStateFlow`/`LruCache` in a repository or singleton. Fastest, lost on process death, bounded by size. Good for hot data within a session.
- **Disk / database** — **Room** (structured), **DataStore** (key-value), files. Survives process death; the basis of **offline-first** (DB as single source of truth).
- **HTTP cache** — **OkHttp's** disk cache honoring `Cache-Control`/`ETag` for network responses.
- **Image cache** — Coil/Glide's memory + disk LRU.

**Read strategies:**
- **Cache-then-network** — show cached data instantly, fetch in background, update. Best UX for feeds.
- **Cache-aside (lazy)** — check cache; on miss, fetch and populate.
- **Network-first with cache fallback** — fresh when possible, cache when offline.
- **Read-through** — the cache layer fetches on miss transparently.

**Invalidation (the hard part — "two hard things in CS"):**
- **TTL / expiry** — store a timestamp; refetch when stale.
- **ETag / Last-Modified** — conditional requests; server returns `304 Not Modified` to save bandwidth.
- **Event/push-based** — invalidate on a known mutation (user edited data) or a server push.
- **Manual** — pull-to-refresh forces a fetch.

**Design decisions interviewers want:**
- **Single source of truth** — write network results into the DB and have the UI observe the DB, rather than caching in multiple places that drift.
- **Eviction** — bound caches (`LruCache`, Room cleanup) so they don't grow unbounded.
- **Consistency vs freshness vs cost** — name the trade-off: a longer TTL saves data/battery but risks staleness.
- **Stale-while-revalidate** — serve stale immediately, refresh in the background.

**Soundbite:** "Layer caches (memory → Room/DataStore → OkHttp/image caches), make the DB the single source of truth, and choose a read strategy (cache-then-network) plus an invalidation policy (TTL/ETag/event-based). The trade-off to name is freshness vs cost vs consistency."
