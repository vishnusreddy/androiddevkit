---
question: "How do you handle one-off events (navigation, snackbars) vs state in a ViewModel?"
topic: architecture
difficulty: senior
tags: ["events", "state", "sharedflow", "udf"]
---

The problem: **state** is persistent and re-emitted (a `StateFlow` replays its current value on rotation), but **events** like "navigate to detail" or "show snackbar" should happen **exactly once**. Putting an event in `StateFlow` causes it to **re-fire** on configuration change (navigation loops, duplicate snackbars).

**The common approaches:**

**1. `SharedFlow` / `Channel` with `replay = 0`** — events are delivered once to active collectors, not replayed.
```kotlin
private val _events = Channel<UiEvent>(Channel.BUFFERED)
val events = _events.receiveAsFlow()   // each event consumed once

fun onSave() = viewModelScope.launch {
    repo.save(); _events.send(UiEvent.NavigateBack)
}
```
A `Channel` guarantees each event goes to a **single** consumer and **suspends** if no one's collecting (events buffer rather than drop) — often preferred over `SharedFlow(replay=0)` which can drop events emitted with no active collector.

**2. State-based events (the modern recommendation from some Google guidance)** — model the event as **state that the UI consumes and tells the ViewModel to clear**:
```kotlin
data class UiState(val navigateToId: String? = null)
// UI: LaunchedEffect(state.navigateToId) { id -> navigate(id); vm.consumedNavigation() }
```
This keeps a single source of truth and is process-death safe, at the cost of a "consume" callback.

**The collection side matters:** collect events with **lifecycle awareness** (`repeatOnLifecycle(STARTED)` / `collectAsStateWithLifecycle`) so an event isn't delivered to a backgrounded UI and lost.

**What to avoid:**
- **`SingleLiveEvent`** / "event wrapper" hacks — historically used, now discouraged (fragile, doesn't compose well).
- Putting transient events in `StateFlow` — they replay on rotation.

**The nuance interviewers want:** there's genuine debate here. `Channel`/`SharedFlow(replay=0)` is the pragmatic, widely-used answer; the "events as state you consume" approach is more UDF-pure and process-death safe. Be able to argue both.

**Soundbite:** "State persists and replays; events must fire once. Use a `Channel`/`SharedFlow(replay=0)` collected lifecycle-aware, or model the event as consumable state — not `StateFlow` (replays on rotation) and not the deprecated `SingleLiveEvent`."
