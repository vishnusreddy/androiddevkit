---
question: "StateFlow vs SharedFlow - how do you choose, and how do you model one-time events?"
topic: coroutines
difficulty: mid
order: 160
starred: true
section: "State and lifecycle"
tags: ["flow", "stateflow", "sharedflow", "events"]
---

Use **`StateFlow` for state** and **`SharedFlow` for broadcasts or events**.

`StateFlow` always has a current value. A new collector immediately receives
that value, which makes it a natural fit for a screen's loading, content, and
error state.

```kotlin
private val _state = MutableStateFlow(UiState.Loading)
val state: StateFlow<UiState> = _state.asStateFlow()
_state.value = UiState.Loaded(items)   // synchronous, has a current value
```

`SharedFlow` does not need to hold one current value. You can configure whether
it replays old values and how it buffers new ones. That makes it useful when
several collectors need the same stream of events.

```kotlin
private val _events = MutableSharedFlow<Event>()   // replay = 0 by default
val events: SharedFlow<Event> = _events.asSharedFlow()
suspend fun navigate() = _events.emit(Event.GoToDetail)
```

**Choosing:**
- **State that the screen renders** (loading/content/error) → `StateFlow`.
- **Transient broadcasts for active collectors** (analytics ticks, refresh signals, a snackbar that may be dropped while the UI is absent) → `SharedFlow` with `replay = 0`.

**Why not put consumable events directly in `StateFlow`?** It retains the last value and replays it, so a naïve snackbar or navigation value may run again after recreation. `SharedFlow(replay = 0)` avoids replay, but it can drop an event when there is no collector. If delivery must survive the UI stopping, model the outcome as durable UI state (often the best option) or use an explicit queued-event design. State vs event is a delivery-semantics decision, not just a type choice.

**Optional details:**
- `MutableStateFlow.value` updates are conflated - fast intermediate values can be skipped; a rapidly emitting `StateFlow` won't deliver every value, only the latest.
- Equality matters: `StateFlow` skips emissions that are `equals` to the current - using a `data class` for state means `copy()`-ing is what makes it emit.
- `SharedFlow.emit` **suspends** if the buffer is full; `tryEmit` doesn't.
