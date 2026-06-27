---
question: "What is Unidirectional Data Flow (UDF), and why is it the foundation of modern Android architecture?"
topic: architecture
difficulty: mid
tags: ["udf", "state", "mvi", "architecture"]
---

**Unidirectional Data Flow** means **state flows down** and **events flow up** — in one direction, forming a loop:

```
        ┌──────────── state ────────────┐
        ▼                               │
       UI  ──── events/intents ──▶  ViewModel ──▶ (repository / use case)
                                        │
                                  produces new state
```

- The **ViewModel owns the state** (a single, immutable `UiState`) and exposes it as a read-only `StateFlow`.
- The **UI is a function of that state** — it renders whatever the state says.
- The **UI sends events up** (button clicks, text input) as method calls/intents; it never mutates state directly.
- The ViewModel processes the event, produces a **new immutable state**, and the cycle repeats.

```kotlin
private val _state = MutableStateFlow(UiState())
val state: StateFlow<UiState> = _state.asStateFlow()   // down (read-only)

fun onRefresh() {                                       // up (event)
    viewModelScope.launch { _state.update { it.copy(loading = true) } }
}
```

**Why it's foundational:**
- **Single source of truth** — state lives in one place; the UI can't drift out of sync.
- **Predictable & debuggable** — every UI state is reproducible from one object; you can log/replay state transitions.
- **Testable** — feed events, assert on emitted states; no UI needed.
- **Thread-safe updates** via immutable `copy()` + atomic `update {}`.
- It's the principle behind **MVI**, Compose (`UI = f(state)`), and Google's recommended architecture — the acronym matters less than the **one-directional** discipline.

**Related practices:** model **one-off events** (navigation, snackbars) separately (e.g. `SharedFlow`) so they don't replay on rotation; keep `UiState` immutable.

**Soundbite:** "UDF = state down, events up, with the ViewModel owning a single immutable state and the UI as a pure function of it. It gives a single source of truth that's predictable, testable, and impossible to desync — the basis of MVI and Compose."
