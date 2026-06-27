---
question: "Show the idiomatic way to expose state and handle events from a ViewModel with Flow."
topic: coroutines
difficulty: mid
tags: ["coroutines", "flow", "practical", "viewmodel", "udf"]
---

The standard pattern: a **private mutable** state holder exposed as a **public read-only** flow, with one-off events on a separate `SharedFlow`.

```kotlin
class FeedViewModel(private val repo: FeedRepository) : ViewModel() {

    // State: private mutable, public read-only
    private val _state = MutableStateFlow(FeedUiState())
    val state: StateFlow<FeedUiState> = _state.asStateFlow()

    // One-off events: SharedFlow with replay = 0 (don't replay on rotation)
    private val _events = MutableSharedFlow<FeedEvent>()
    val events: SharedFlow<FeedEvent> = _events.asSharedFlow()

    init {
        repo.observeFeed()
            .onStart { _state.update { it.copy(loading = true) } }
            .onEach { items -> _state.update { it.copy(loading = false, items = items) } }
            .catch { _state.update { it.copy(loading = false, error = it.message) } }
            .launchIn(viewModelScope)
    }

    fun onItemClick(id: String) = viewModelScope.launch {
        _events.emit(FeedEvent.OpenDetail(id))   // navigation = event, not state
    }
}
```

Why each choice:
- **`asStateFlow()` / `asSharedFlow()`** expose read-only views so the UI can't mutate state — enforcing **unidirectional data flow**.
- **`_state.update { it.copy(...) }`** is atomic and works on immutable `data class` state.
- **State vs event split** — render-able state goes in `StateFlow` (survives rotation, has a current value); transient actions like navigation/snackbars go in `SharedFlow(replay = 0)` so they fire **once** and don't replay on configuration change.

The UI collects `state` with `collectAsStateWithLifecycle()` (Compose) or `repeatOnLifecycle` (Views), and collects `events` to trigger navigation/toasts.
