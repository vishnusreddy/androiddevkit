---
question: "What is Unidirectional Data Flow (UDF), and why is it the foundation of modern Android architecture?"
topic: architecture
difficulty: mid
order: 60
starred: true
section: "Presentation and state"
tags: ["udf", "state", "mvi", "architecture"]
---

**Unidirectional Data Flow** means **state flows down** and **events flow up** - in one direction, forming a loop:

![Unidirectional data flow loop between UI, ViewModel, and repository](/diagrams/udf-loop.svg)

- The **ViewModel owns the state** (a single, immutable `UiState`) and exposes it as a read-only `StateFlow`.
- The **UI is a function of that state** - it renders whatever the state says.
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
- **Single source of truth** - state lives in one place; the UI can't drift out of sync.
- **Predictable & debuggable** - every UI state is reproducible from one object; you can log/replay state transitions.
- **Testable** - feed events, assert on emitted states; no UI needed.
- **Thread-safe updates** via immutable `copy()` + atomic `update {}`.
- It's the principle behind **MVI**, Compose (`UI = f(state)`), and Google's recommended architecture - the acronym matters less than the **one-directional** discipline.

**Related practices:** keep `UiState` immutable. Model business outcomes as
state and let the UI react with navigation or messages. Use an ephemeral stream
only when its best-effort delivery semantics are acceptable.
