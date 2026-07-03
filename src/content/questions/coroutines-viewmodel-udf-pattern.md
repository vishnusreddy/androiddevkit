---
question: "Show the idiomatic way to expose state and handle events from a ViewModel with Flow."
topic: coroutines
difficulty: mid
order: 180
starred: false
section: "State and lifecycle"
tags: ["coroutines", "flow", "practical", "viewmodel", "udf"]
---

The standard pattern is a **private mutable** state holder exposed as a
**public read-only** flow. The UI sends input events to ViewModel methods; the
ViewModel reduces data and outcomes into immutable UI state.

```kotlin
class FeedViewModel(private val repo: FeedRepository) : ViewModel() {
    private val _state = MutableStateFlow(FeedUiState())
    val state: StateFlow<FeedUiState> = _state.asStateFlow()

    init {
        repo.observeFeed()
            .onStart { _state.update { it.copy(loading = true) } }
            .onEach { items -> _state.update { it.copy(loading = false, items = items) } }
            .catch { error ->
                if (error is CancellationException) throw error
                _state.update {
                    it.copy(loading = false, userMessage = error.toUserMessage())
                }
            }
            .launchIn(viewModelScope)
    }

    fun onRetry() {
        // Start or signal the retry operation owned by this ViewModel.
    }

    fun onMessageShown(messageId: String) {
        _state.update { current ->
            if (current.userMessage?.id == messageId) {
                current.copy(userMessage = null)
            } else {
                current
            }
        }
    }
}
```

Why each choice:
- **`asStateFlow()`** prevents the UI from mutating the source and enforces
  **unidirectional data flow**.
- **`_state.update { it.copy(...) }`** is atomic and works on immutable `data class` state.
- **Expected failures become state**, not uncaught exceptions. Cancellation must
  still be rethrown rather than mapped to an error message.
- **Acknowledgement includes an ID**, so handling an old message cannot clear a
  newer one that arrived first.

The UI collects state with `collectAsStateWithLifecycle()` in Compose or
`repeatOnLifecycle` in Views. Navigation caused directly by a click can stay in
the UI. If navigation depends on a business result, expose that result as
acknowledgeable state. A zero-replay SharedFlow remains suitable only for
best-effort signals that are allowed to disappear while no collector is active.
