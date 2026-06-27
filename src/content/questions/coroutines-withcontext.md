---
question: "withContext vs launch vs async - when do you use each?"
topic: coroutines
difficulty: mid
tags: ["coroutines", "builders", "withContext"]
---

They all run code in a coroutine, but serve different purposes.

- **`withContext(ctx) { }`** - a **suspend** function that runs a block in a different context (usually a different dispatcher) and **returns its result**. It does *not* start a concurrent coroutine - it suspends the current one until the block finishes. Use it to **switch threads** for a piece of work.
- **`launch { }`** - starts a **new concurrent** coroutine, returns a `Job`, no result. Fire-and-forget.
- **`async { }`** - starts a **new concurrent** coroutine, returns a `Deferred<T>` you `await()`. Use for concurrent work you'll combine.

```kotlin
// withContext: switch to IO, get the result back, sequential
suspend fun load() = withContext(Dispatchers.IO) { api.fetch() }

// async: two things at once
suspend fun loadBoth() = coroutineScope {
    val a = async { api.fetchA() }
    val b = async { api.fetchB() }
    a.await() to b.await()
}
```

**The common mistake:** using `async { }.await()` immediately to switch threads:
```kotlin
val data = async(Dispatchers.IO) { fetch() }.await()  // ❌ pointless
val data = withContext(Dispatchers.IO) { fetch() }    // ✅ clearer, cheaper
```
If you're going to `await` right away, you want `withContext` - `async` is only worth it when you start **multiple** and await them later.

**Rule of thumb:** one result, switch context → `withContext`; concurrent work to combine → `async`; side-effect with no result → `launch`.
