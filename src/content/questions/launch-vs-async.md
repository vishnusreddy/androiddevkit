---
question: "What's the difference between launch and async in coroutines?"
topic: coroutines
difficulty: junior
order: 30
starred: true
section: "Coroutine foundations"
tags: ["coroutines", "concurrency"]
---

Both are coroutine builders, but they differ in what they return and how you use the result.

- **`launch`** starts a coroutine and returns a `Job`. Use it for work whose outcome is completion rather than a returned value. It is still **owned by its scope**. Callers should be able to cancel it or observe failure, so “fire and forget” is a misleading mental model.
- **`async`** returns a `Deferred<T>`, a `Job` that also carries a result. You call `.await()` to get the value. Use it for **concurrent work you need to combine**.

```kotlin
// Run two network calls concurrently, then combine.
suspend fun loadDashboard() = coroutineScope {
    val user = async { api.getUser() }
    val feed = async { api.getFeed() }
    Dashboard(user.await(), feed.await())
}
```

**Interview trap:** calling `async { ... }.await()` immediately, one after another, runs them *sequentially* - you've lost the concurrency. Start all the `async` blocks first, then `await` them.

**Exception nuance:** `async` stores its failure in the `Deferred`, so `await()` rethrows it. But if that `async` is a regular child, its failure also cancels its parent immediately. Waiting to call `await()` does not prevent structured-concurrency propagation. A root `launch` reports an uncaught failure immediately; a root `async` exposes it through `await()`.
