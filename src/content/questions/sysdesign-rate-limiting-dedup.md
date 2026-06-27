---
question: "How do you handle request deduplication, coalescing, and client-side rate limiting?"
topic: system-design
difficulty: senior
tags: ["system-design", "networking", "deduplication", "performance"]
---

All three ideas answer one simple question: **how do we avoid doing the same
network work too often?** They save battery and data while also protecting the
server.

**Deduplication or coalescing:** if several callers request the same resource at
the same time, make one network call and share its result.
```kotlin
// Coalesce identical in-flight requests
private val inFlight = mutableMapOf<String, Deferred<User>>()

suspend fun getUser(id: String): User = coroutineScope {
    inFlight.getOrPut(id) {
        async { api.getUser(id) }.also { it.invokeOnCompletion { inFlight.remove(id) } }
    }.await()
}
```
- Common when several composables/observers request the same resource at once (e.g. a feed refresh triggered from two places).
- A **`StateFlow` with `shareIn`/`stateIn(WhileSubscribed)`** naturally coalesces collectors onto one upstream.

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
