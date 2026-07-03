---
question: "What is suspendCancellableCoroutine and when do you use it?"
topic: coroutines
difficulty: senior
order: 70
starred: false
section: "Channels and callback interop"
tags: ["coroutines", "interop", "suspendCancellableCoroutine"]
---

`suspendCancellableCoroutine` converts a **single-shot callback** API into a `suspend` function. It suspends the coroutine and hands you a `Continuation` to resume when the callback fires.

```kotlin
suspend fun FusedLocationProviderClient.awaitLocation(): Location =
    suspendCancellableCoroutine { cont ->
        val task = lastLocation
        task.addOnSuccessListener { location ->
            cont.resume(location)                 // resume with result
        }
        task.addOnFailureListener { e ->
            cont.resumeWithException(e)            // resume by throwing
        }
        // Clean up if the coroutine is cancelled while waiting
        cont.invokeOnCancellation { /* cancel the task */ }
    }
```

The contract:
- Complete the continuation exactly once with `resume(value)` or
  `resumeWithException(e)`. A second completion attempt throws an
  `IllegalStateException` (typically reported as "Already resumed") and usually
  signals a race between callback paths.
- **`invokeOnCancellation { }`** lets you cancel the underlying operation if the coroutine is cancelled while suspended - this is why you use the **`Cancellable`** variant over plain `suspendCoroutine`.

**`suspendCancellableCoroutine` vs `callbackFlow`:**
- `suspendCancellableCoroutine` → **one** value (a single async result). Like awaiting a `Task`/`Future`.
- `callbackFlow` → a **stream** of values from a listener over time.

**Real uses:** awaiting a `Play Services Task`, a one-time `AsyncLayoutInflater`, an old listener-based SDK call, or bridging Java `Future`/`Call` into suspend. Many libraries already provide `await()` extensions built on exactly this.
