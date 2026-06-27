---
question: "What's the difference between launch and async in coroutines?"
topic: coroutines
difficulty: junior
tags: ["coroutines", "concurrency"]
---

Both are coroutine builders, but they differ in what they return and how you use the result.

- **`launch`** fires off a coroutine and returns a `Job`. It's "fire and forget" — use it when you don't need a result back, e.g. updating UI or writing to a database.
- **`async`** returns a `Deferred<T>`, a `Job` that also carries a result. You call `.await()` to get the value. Use it for **concurrent work you need to combine**.

```kotlin
// Run two network calls concurrently, then combine.
suspend fun loadDashboard() = coroutineScope {
    val user = async { api.getUser() }
    val feed = async { api.getFeed() }
    Dashboard(user.await(), feed.await())
}
```

**Interview trap:** calling `async { ... }.await()` immediately, one after another, runs them *sequentially* — you've lost the concurrency. Start all the `async` blocks first, then `await` them.

Also know that an exception in `async` is thrown at the `await()` call site, whereas a `launch` exception propagates straight to the scope's `CoroutineExceptionHandler`.
