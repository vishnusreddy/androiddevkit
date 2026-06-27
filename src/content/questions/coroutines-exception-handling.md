---
question: "How do exceptions behave in launch and async coroutines?"
topic: coroutines
difficulty: mid
tags: ["coroutines", "error-handling", "exceptions"]
---

The behavior depends on the builder.

**`launch`** - an uncaught exception **propagates immediately** up the Job hierarchy and is treated as uncaught. It can be handled by a **`CoroutineExceptionHandler`** installed in the scope (or by `try/catch` *inside* the coroutine).

**`async`** - the exception is **deferred** and rethrown when you call **`await()`**. So you wrap the `await()` in `try/catch`. A `CoroutineExceptionHandler` does **not** catch it (the exception is "held" in the Deferred).

```kotlin
val handler = CoroutineExceptionHandler { _, e -> Log.e("TAG", "caught $e") }

// launch → handler catches it
scope.launch(handler) { throw IOException() }

// async → must catch at await()
val deferred = scope.async { throw IOException() }
try { deferred.await() } catch (e: IOException) { /* handle */ }
```

**Things that trip people up:**
- **`try/catch` around `launch { }` doesn't work** - the builder returns immediately; the exception happens later, inside the coroutine. Put the `try/catch` *inside* the coroutine, or use a handler.
- A `CoroutineExceptionHandler` only works on the **root** coroutine of a scope (or a `SupervisorJob` child), not on a nested `launch` whose parent is a regular Job - the exception propagates up first.
- **`CancellationException` is special** - it's not treated as a failure and doesn't trigger the handler.
- With a regular `Job`, one child's exception cancels siblings; with `SupervisorJob`/`supervisorScope`, children fail independently and each needs its own handling.
