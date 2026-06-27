---
question: "How should Compose collect state from a ViewModel?"
topic: jetpack-compose
difficulty: mid
tags: ["compose", "state", "lifecycle", "viewmodel"]
---

You convert the flow into Compose `State` so reads trigger recomposition:

```kotlin
@Composable
fun FeedScreen(viewModel: FeedViewModel = hiltViewModel()) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    FeedContent(state)
}
```

**`collectAsState()` vs `collectAsStateWithLifecycle()`:**
- **`collectAsState()`** collects the flow as long as the composable is in **composition** - *including when the app is in the background*. It keeps the upstream active and doing work even when the screen isn't visible.
- **`collectAsStateWithLifecycle()`** (from `lifecycle-runtime-compose`) collects only while the lifecycle is at least **STARTED**, using `repeatOnLifecycle` under the hood. It stops collecting in the background and resumes in the foreground.

**Why the lifecycle-aware one is the recommended default on Android:**
- Avoids wasted work, CPU, and battery while backgrounded.
- Lets the upstream (`stateIn(WhileSubscribed(5000))`) actually stop, since collection is properly cancelled.
- Prevents updates to UI state that isn't visible.

**Notes:**
- `collectAsState()` is still appropriate for **non-Android / multiplatform** Compose where there's no lifecycle.
- Pass an explicit `lifecycle`/`minActiveState` if you need a state other than STARTED.
- It pairs naturally with the `stateIn(..., WhileSubscribed(5000), ...)` upstream pattern in the ViewModel.
