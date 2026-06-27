---
question: "How do you add a timeout to a coroutine? withTimeout vs withTimeoutOrNull."
topic: coroutines
difficulty: mid
order: 60
starred: false
section: "Scope ownership"
tags: ["coroutines", "timeout", "cancellation"]
---

Two builders cap how long a block may run:

- **`withTimeout(ms)`** - throws **`TimeoutCancellationException`** if the block doesn't finish in time.
- **`withTimeoutOrNull(ms)`** - returns **`null`** instead of throwing on timeout.

```kotlin
// Throws on timeout - handle with try/catch
val data = try {
    withTimeout(5_000) { api.fetch() }
} catch (e: TimeoutCancellationException) {
    fallback()
}

// Returns null on timeout - clean for "best effort"
val data = withTimeoutOrNull(5_000) { api.fetch() } ?: fallback()
```

**How it works:** on timeout the block is **cancelled** (cooperatively - same rules as normal cancellation). So the timed work must reach a suspension point or check `isActive`, or the timeout won't fire until it does.

**Gotchas interviewers like:**
- `TimeoutCancellationException` is a subclass of `CancellationException`. If you cancel inside the block and catch broadly, you can accidentally swallow it - and a blanket `catch (e: Exception)` around `withTimeout` will catch the timeout but *also* risks eating real cancellation.
- The timeout cancels the block, but cleanup in `finally` still runs. If cleanup suspends, wrap it in `withContext(NonCancellable)`.
- For a non-cancelling timeout (let the work finish but stop *waiting*), race it with `select`/a separate `delay` instead.
