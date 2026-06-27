---
question: "How do exceptions behave in launch and async coroutines?"
topic: coroutines
difficulty: mid
order: 70
starred: true
section: "Scope ownership"
tags: ["coroutines", "error-handling", "exceptions"]
---

The behavior depends on the builder.

**`launch`** - an uncaught exception **propagates immediately** up the Job hierarchy. A **root** `launch` reports it to a `CoroutineExceptionHandler` (or the thread's uncaught-exception handler). A child delegates handling to its parent.

**`async`** - stores the exception and rethrows it from **`await()`**. A `CoroutineExceptionHandler` does not consume a root `async` failure because the caller is expected to observe the `Deferred`.

```kotlin
val handler = CoroutineExceptionHandler { _, e -> Log.e("TAG", "caught $e") }

// Root launch → handler reports it
scope.launch(handler) { throw IOException() }

// async → must catch at await()
val deferred = scope.async { throw IOException() }
try { deferred.await() } catch (e: IOException) { /* handle */ }
```

**The interview-grade nuance:** in a normal `coroutineScope`, a child created with `async` still cancels its parent as soon as it fails. Catching only `await()` from inside that already-cancelled scope is often too late. Use `supervisorScope` when children should fail independently, and then handle each `await()` result.

**Things that trip people up:**
- **`try/catch` around `launch { }` doesn't work** - the builder returns immediately; the exception happens later, inside the coroutine. Put the `try/catch` *inside* the coroutine, or use a handler.
- A `CoroutineExceptionHandler` is a last-resort reporter for an **uncaught root failure**, not a recovery mechanism. It cannot make the failed coroutine continue.
- **`CancellationException` is special** - it's not treated as a failure and doesn't trigger the handler.
- With a regular `Job`, one child's exception cancels siblings; with `SupervisorJob`/`supervisorScope`, children fail independently and each needs its own handling.
