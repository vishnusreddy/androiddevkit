---
question: "How do you handle request deduplication, coalescing, and client-side rate limiting?"
topic: system-design
difficulty: senior
order: 40
starred: false
section: "Sync and real-time"
tags: ["system-design", "networking", "deduplication", "performance"]
---

All three ideas answer one simple question: **how do we avoid doing the same
network work too often?** They save battery and data while also protecting the
server.

**Deduplication or coalescing:** if several callers request the same resource at
the same time, make one network call and share its result. A production
single-flight implementation needs more than a mutable map:

- Protect the in-flight map with a `Mutex` or another concurrency-safe primitive.
- Define who owns the shared request. If it is a child of the first caller, that
  caller's cancellation can cancel work that later callers still need.
- Remove the entry on success, failure, and cancellation without racing a newer
  request for the same key.
- Decide whether to cancel when all subscribers leave or let a repository-owned
  operation finish and populate the cache.

Libraries and a shared repository `Flow` may already provide the required
single-flight behavior. Prefer a tested abstraction over a clever map of
`Deferred` values.
- Common when several composables/observers request the same resource at once (e.g. a feed refresh triggered from two places).
- A Flow shared with `shareIn` or `stateIn` can coalesce collectors onto one
  upstream, with lifetime controlled by its sharing policy.

**Caching:** keep a recent result for a short time so repeated reads do not need
another request. TTL means "time to live," or how long that result is considered
fresh.

**Client-side rate limiting / throttling:**
- **Debounce** rapid user-triggered requests (search, button mashing).
- **Throttle** high-frequency events (scroll-triggered loads) to a max rate.
- **Coalesce writes** - batch rapid updates (e.g. analytics, "mark as read") into one request.
- Cap **concurrency** (a bounded dispatcher / `Semaphore` / OkHttp dispatcher `maxRequests`) so you don't open 50 sockets at once.

**Respect server rate limits:**
- Honor **`429 Too Many Requests`** + **`Retry-After`**; back off rather than retry-storm.
- A **circuit breaker** when the backend is failing.

**Cancellation** - cancel obsolete requests (screen left, query changed via `flatMapLatest`) so you don't waste a response no one needs.

**Why it matters on mobile:** every redundant request costs **battery (radio), data, and server load**, and can trigger rate limits. Dedup + coalescing + caching collapse N requests into 1.

**Trade-offs to name:** dedup window/cache TTL (freshness vs request savings), throttle/debounce timing (responsiveness vs request volume), concurrency cap (throughput vs resource use), aggressive coalescing (efficiency vs slight staleness).
