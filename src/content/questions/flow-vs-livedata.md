---
question: "When would you use StateFlow over LiveData?"
topic: coroutines
difficulty: junior
order: 90
starred: true
section: "Flow foundations"
tags: ["flow", "state", "lifecycle"]
---

`StateFlow` and `LiveData` are both observable, lifecycle-friendly state holders, but `StateFlow` is the modern default in a coroutine-first codebase.

| | `LiveData` | `StateFlow` |
|---|---|---|
| Always has a value | No; it may be unset | Yes (requires initial value) |
| Lifecycle-aware | Built in | Via `repeatOnLifecycle` / `collectAsStateWithLifecycle` |
| Operators | Few (`map`, `switchMap`) | Full Flow operator set |
| Threading | Main-thread bound | Any dispatcher |
| Pure Kotlin (testable, multiplatform) | No (Android dep) | Yes |

**Choose `StateFlow` when** you want a single source of truth that's always set, you need Flow operators (`combine`, `debounce`, `flatMapLatest`), or you're in a shared/KMP module with no Android dependency. Collect it with lifecycle awareness (`repeatOnLifecycle` in Views or `collectAsStateWithLifecycle` in Compose).

```kotlin
private val _state = MutableStateFlow(UiState.Loading)
val state: StateFlow<UiState> = _state.asStateFlow()
```

The catch: `StateFlow` isn't lifecycle-aware on its own. Collect it safely so you don't waste work while the UI is in the background:

```kotlin
// Compose
val state by viewModel.state.collectAsStateWithLifecycle()

// Views
lifecycleScope.launch {
    repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.state.collect { render(it) }
    }
}
```

**Do not choose `SharedFlow` merely because something is called an event.** A
`SharedFlow(replay = 0)` does not replay to a collector that was absent, so it
can drop navigation or message signals while the UI is stopped. Model outcomes
that must be observed as durable state; use SharedFlow only when best-effort
broadcast delivery matches the requirement.
