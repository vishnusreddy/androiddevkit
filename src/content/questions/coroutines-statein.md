---
question: "What do stateIn and shareIn do, and why use SharingStarted.WhileSubscribed?"
topic: coroutines
difficulty: senior
tags: ["flow", "stateIn", "shareIn", "sharing"]
---

`stateIn` and `shareIn` convert a **cold** flow into a **hot** one so an expensive upstream (a DB query, a network poll) runs **once and is shared** across collectors, instead of restarting per subscriber.

- **`stateIn`** → produces a `StateFlow` (has a current value; needs an initial value).
- **`shareIn`** → produces a `SharedFlow` (configurable replay; no current-value requirement).

```kotlin
val uiState: StateFlow<UiState> = repository.observeData()  // cold, restarts per collector
    .map { it.toUiState() }
    .stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = UiState.Loading,
    )
```

**The `started` strategy controls when the upstream is active:**
- **`Eagerly`** - starts immediately, never stops. Wastes work if no one's listening.
- **`Lazily`** - starts on the first collector, then stays forever.
- **`WhileSubscribed(stopTimeoutMillis)`** - active only while there's a subscriber, and stops `stopTimeout` ms after the last one leaves.

**Why `WhileSubscribed(5000)` is the standard choice:** on a configuration change the UI briefly unsubscribes and resubscribes. The 5-second grace period keeps the upstream alive across rotation (so you don't re-query the DB or re-hit the network), but still stops it when the user actually navigates away and backgrounds the app - preventing leaks and wasted work.
