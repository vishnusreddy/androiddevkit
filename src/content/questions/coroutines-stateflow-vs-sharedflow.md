---
question: "StateFlow vs SharedFlow — how do you choose, and how do you model one-time events?"
topic: coroutines
difficulty: senior
tags: ["flow", "stateflow", "sharedflow", "events"]
---

**`StateFlow`** is a specialized `SharedFlow`: `replay = 1`, always holds a **current value**, and is **conflated + deduplicated** (skips equal consecutive values). It's the natural fit for **UI state**.

```kotlin
private val _state = MutableStateFlow(UiState.Loading)
val state: StateFlow<UiState> = _state.asStateFlow()
_state.value = UiState.Loaded(items)   // synchronous, has a current value
```

**`SharedFlow`** is the general hot flow with tunable `replay`, `extraBufferCapacity`, and `onBufferOverflow`. Use it when you **don't** want a single retained value or built-in dedup.

```kotlin
private val _events = MutableSharedFlow<Event>()   // replay = 0 by default
val events: SharedFlow<Event> = _events.asSharedFlow()
suspend fun navigate() = _events.emit(Event.GoToDetail)
```

**Choosing:**
- **State that the screen renders** (loading/content/error) → `StateFlow`.
- **One-off events** (navigate, show snackbar, toast) → `SharedFlow` with `replay = 0`.

**Why not put events in `StateFlow`?** Because it retains the last value and replays it on rotation — your snackbar would fire again, or navigation would re-trigger. `SharedFlow(replay = 0)` delivers each event once to active collectors and doesn't replay.

**Gotchas:**
- `MutableStateFlow.value` updates are conflated — fast intermediate values can be skipped; a rapidly emitting `StateFlow` won't deliver every value, only the latest.
- Equality matters: `StateFlow` skips emissions that are `equals` to the current — using a `data class` for state means `copy()`-ing is what makes it emit.
- `SharedFlow.emit` **suspends** if the buffer is full; `tryEmit` doesn't.
