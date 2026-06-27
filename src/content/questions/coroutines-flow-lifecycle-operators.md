---
question: "What do onStart, onEach, onCompletion, and onEmpty do on a Flow?"
topic: coroutines
difficulty: mid
order: 110
starred: false
section: "Flow operators"
tags: ["flow", "operators", "lifecycle"]
---

These operators hook into a flow's lifecycle without changing its values - useful for loading states, logging, and cleanup.

```kotlin
repository.observe()
    .onStart { emit(UiState.Loading) }       // before the first upstream value
    .onEach { log("emitted $it") }            // for each value, as it passes
    .onCompletion { cause ->                  // when the flow finishes (or fails)
        if (cause != null) log("failed: $cause") else log("done")
    }
    .catch { emit(UiState.Error) }
    .collect { render(it) }
```

- **`onStart { }`** - runs **before** collection begins; can `emit` values (great for an initial `Loading` state).
- **`onEach { }`** - a side effect per value; returns the value unchanged. Pairs with `launchIn` to collect without a `collect` block.
- **`onCompletion { cause -> }`** - runs when the flow **terminates** for any reason: normal completion (`cause == null`), error (`cause != null`), or cancellation. Use it for cleanup or final logging. Unlike `catch`, it does **not** swallow the exception - it just observes it.
- **`onEmpty { }`** - runs if the flow completed **without emitting anything**; can emit a default.

**`onCompletion` vs `finally`:** `onCompletion` is the declarative, flow-aware way to run teardown and **sees the terminal cause**, including downstream cancellation - clearer than wrapping `collect` in `try/finally`.

```kotlin
// Collect without a trailing lambda:
flow.onEach { render(it) }.launchIn(viewModelScope)
```
