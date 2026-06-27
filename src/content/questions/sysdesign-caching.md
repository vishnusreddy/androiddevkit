---
question: "What caching strategies and layers would you use in a mobile client?"
topic: system-design
difficulty: mid
tags: ["system-design", "caching", "performance", "offline"]
---

Caching is the backbone of a fast, offline-capable mobile app. Design it in **layers** with an explicit **invalidation** policy.

**Cache layers (fastest → most durable):**
- **Memory** - `LruCache` / `StateFlow` in repositories; fastest, lost on process death, size-bounded. Hot data within a session.
- **Disk / database** - **Room** (structured, queryable, observable), **DataStore** (key-value), files. Survives restarts; the basis of **offline-first** (DB = single source of truth).
- **HTTP cache** - **OkHttp**'s disk cache honoring `Cache-Control`/`ETag`/`Last-Modified`.
- **Media cache** - Coil/Glide memory + disk LRU for images.

**Read strategies:**
- **Cache-then-network** - render cached data instantly, refresh in the background, update UI. Best feed UX.
- **Cache-aside** - check cache; on miss fetch and populate.
- **Network-first, cache-fallback** - freshness-critical data with offline resilience.
- **Stale-while-revalidate** - serve stale immediately, revalidate in background.

**Invalidation (the hard part):**
- **TTL / expiry** - store a timestamp, refetch when stale.
- **ETag / conditional requests** - server returns `304 Not Modified` → no payload, saves data/battery.
- **Event-based** - invalidate on a known mutation or a push signal.
- **Manual** - pull-to-refresh.

**Mobile-specific considerations:**
- **Single source of truth** - write network results to the DB; the UI observes the DB, so caches don't drift across the app.
- **Bounded eviction** - `LruCache` sizes, Room cleanup jobs; respect device storage limits.
- **Battery/data awareness** - longer TTLs and conditional requests reduce radio usage; prefetch on Wi-Fi.
- **Security** - don't cache sensitive data unencrypted; clear caches on logout.

**Trade-offs to name:** **freshness vs data/battery cost vs consistency** - e.g. a long TTL saves bandwidth but risks staleness; cache-then-network shows possibly-stale content for a moment to gain instant load.
