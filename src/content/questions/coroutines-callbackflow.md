---
question: "How do you convert a callback-based API into a Flow? (callbackFlow / channelFlow)"
topic: coroutines
difficulty: senior
tags: ["flow", "callbackflow", "interop"]
---

Use **`callbackFlow`** to bridge a listener/callback API (location updates, Firebase listeners, sensor events) into a cold Flow.

```kotlin
fun locationUpdates(client: FusedLocationProviderClient): Flow<Location> = callbackFlow {
    val callback = object : LocationCallback() {
        override fun onLocationResult(result: LocationResult) {
            result.lastLocation?.let { trySend(it) }   // emit into the flow
        }
    }
    client.requestLocationUpdates(request, callback, Looper.getMainLooper())

    // REQUIRED: suspend until the collector cancels, then clean up
    awaitClose { client.removeLocationUpdates(callback) }
}
```

The essential pieces:
- **`trySend(value)`** (or `send`) emits from inside the callback. `callbackFlow` provides a channel, so emission is allowed from other threads/contexts (unlike a plain `flow { }`).
- **`awaitClose { }`** is **mandatory** - it keeps the flow alive while the callback is registered and runs your **teardown** (unregister the listener) when the collector cancels or the flow completes. Forgetting it throws and, worse, leaks the listener.

**`callbackFlow` vs `channelFlow`:** both give you a channel-backed flow you can emit to from multiple contexts. `callbackFlow` is `channelFlow` specialized for the callback-bridging pattern (it expects an `awaitClose`). Use `channelFlow` when you need concurrent emission from multiple coroutines.

**Why not `flow { }`?** A plain `flow { }` enforces context preservation and can't emit from a callback on another thread - `callbackFlow` exists precisely to handle that case safely.
