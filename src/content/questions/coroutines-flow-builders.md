---
question: "What are the main ways to create a Flow?"
topic: coroutines
difficulty: junior
tags: ["flow", "builders"]
---

The common Flow builders:

```kotlin
// 1. flow { } — the general builder; call emit() inside
val f1 = flow {
    emit(1)
    delay(100)
    emit(2)
}

// 2. flowOf(...) — fixed set of values
val f2 = flowOf("a", "b", "c")

// 3. asFlow() — from a collection, range, or sequence
val f3 = (1..5).asFlow()
val f4 = listOf("x", "y").asFlow()

// 4. channelFlow { } / callbackFlow { } — emit from other contexts/callbacks
val f5 = callbackFlow {
    val l = listener { trySend(it) }
    register(l); awaitClose { unregister(l) }
}

// 5. MutableStateFlow / MutableSharedFlow — hot flows you push into
val state = MutableStateFlow(0)
```

**How to pick:**
- **`flow { }`** — most cases; sequential emission, context-preserving (use `flowOn` to switch dispatchers).
- **`flowOf` / `asFlow`** — wrap existing values/collections.
- **`channelFlow` / `callbackFlow`** — when you must emit from a **callback** or **multiple coroutines/threads** (a plain `flow { }` forbids cross-context emission).
- **`StateFlow` / `SharedFlow`** — hot, shared, observable app state/events.

**Note:** `flow { }`, `flowOf`, and `asFlow` are **cold** — the block runs per collector, only when collected. `StateFlow`/`SharedFlow` are **hot**.
