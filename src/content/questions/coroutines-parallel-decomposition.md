---
question: "How do you run multiple independent suspend calls in parallel and combine the results?"
topic: coroutines
difficulty: mid
tags: ["coroutines", "async", "practical", "parallel"]
---

Use `async` inside a `coroutineScope` to start each piece concurrently, then `await` them:

```kotlin
suspend fun loadDashboard(): Dashboard = coroutineScope {
    val profile = async { api.profile() }
    val feed    = async { api.feed() }
    val notifs  = async { api.notifications() }
    Dashboard(profile.await(), feed.await(), notifs.await())
}
```

All three calls run at the same time, so total latency ≈ the **slowest** one, not the sum.

**Why `coroutineScope`?** It provides structured concurrency: if any child fails, the others are cancelled and the exception propagates out of `loadDashboard`. It also waits for all children before returning. Never use `GlobalScope.async` here.

**Common mistakes:**
- **Accidentally sequential** — `async { a() }.await()` then `async { b() }.await()` runs them one after another. Start *all* the `async`s first, then await.
- **Wanting independent failures** — if one call failing should *not* cancel the others, use `supervisorScope` and handle each `await()` in its own try/catch.

**For a dynamic list** of inputs, map then await all:
```kotlin
suspend fun loadAll(ids: List<Int>): List<Item> = coroutineScope {
    ids.map { id -> async { api.item(id) } }.awaitAll()
}
```

**Soundbite:** "`coroutineScope { async {} ; async {} }` then `await()` — start everything before awaiting so the calls overlap; `awaitAll()` for a list."
