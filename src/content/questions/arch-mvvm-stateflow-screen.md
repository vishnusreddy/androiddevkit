---
question: "How would you implement an MVVM screen with StateFlow?"
topic: architecture
difficulty: mid
order: 45
starred: true
section: "Presentation and state"
tags: ["mvvm", "stateflow", "viewmodel", "compose", "ui-state"]
---

Expose one immutable state model, accept user actions through methods, and keep
data policy behind a repository.

```kotlin
data class FeedUiState(
    val items: List<Post> = emptyList(),
    val loading: Boolean = true,
    val refreshing: Boolean = false,
    val message: UserMessage? = null,
)

class FeedViewModel(
    private val repository: FeedRepository,
) : ViewModel() {
    private val refreshing = MutableStateFlow(false)
    private val message = MutableStateFlow<UserMessage?>(null)

    val uiState: StateFlow<FeedUiState> = combine(
        repository.observeFeed(), refreshing, message,
    ) { posts, isRefreshing, userMessage ->
        FeedUiState(
            items = posts,
            loading = false,
            refreshing = isRefreshing,
            message = userMessage,
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = FeedUiState(),
    )

    fun refresh() = viewModelScope.launch {
        refreshing.value = true
        try {
            repository.refresh()
        } catch (e: IOException) {
            message.value = UserMessage.NetworkUnavailable
        } finally {
            refreshing.value = false
        }
    }

    fun messageShown(messageId: String) {
        message.update { current -> current?.takeUnless { it.id == messageId } }
    }
}
```

In Compose, collect with lifecycle awareness:

```kotlin
@Composable
fun FeedRoute(viewModel: FeedViewModel = viewModel()) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    FeedScreen(state = state, onRefresh = viewModel::refresh)
}
```

Important details:

- Expose `StateFlow`, not `MutableStateFlow`.
- Keep state immutable and derive values that can be calculated reliably.
- Catch expected failures narrowly. Do not convert coroutine cancellation into a
  normal error.
- Use `WhileSubscribed` when upstream work should stop without collectors. The
  timeout avoids restarting immediately across brief configuration changes.
- Render stale content and refresh status together when both can be true.
- Acknowledge user messages by ID so handling an older message cannot clear a
  newer one.

The exact operators are less important than clear ownership and deterministic
state transitions.
