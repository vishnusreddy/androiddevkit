---
question: "How should a Compose screen collect ViewModel state?"
topic: jetpack-compose
difficulty: mid
order: 60
starred: true
section: "State and recomposition"
tags: ["compose", "state", "lifecycle", "viewmodel", "flow"]
---

On Android, the usual choice is `collectAsStateWithLifecycle()`:

```kotlin
@Composable
fun FeedRoute(viewModel: FeedViewModel = viewModel()) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    FeedScreen(
        state = uiState,
        onRetry = viewModel::retry,
    )
}
```

It converts a `Flow` into Compose `State`, so reading `uiState` participates in
recomposition. Collection is active only while the lifecycle is at least the
configured state, `STARTED` by default.

`collectAsState()` is tied to the composition but not to an Android lifecycle.
That makes it appropriate for platform-independent Compose code. On Android, it
can keep collecting while an Activity is stopped but its composition still
exists.

The lifecycle-aware version pairs well with a `StateFlow` exposed by the
`ViewModel`:

```kotlin
val uiState = repository.feed
    .map(::toUiState)
    .stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = FeedUiState.Loading,
    )
```

When the screen stops collecting, `WhileSubscribed` can eventually stop the
upstream work as well.

Keep the route and content split in mind. A route collects state and connects
the `ViewModel`; a stateless `FeedScreen` receives values and callbacks. That
keeps previews and UI tests simple.

For one-off events, do not automatically put consumable flags into the state and
reset them from composition. Model durable screen state as state, and handle
transient events with a lifecycle-aware design suited to their delivery needs.
