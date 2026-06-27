---
question: "What are viewModelScope and lifecycleScope? When is each cancelled?"
topic: coroutines
difficulty: junior
tags: ["coroutines", "scopes", "lifecycle", "android"]
---

These are pre-built `CoroutineScope`s tied to Android lifecycles, so your coroutines are cancelled automatically.

- **`viewModelScope`** - an extension on `ViewModel`. Cancelled in **`onCleared()`**, i.e. when the ViewModel is destroyed for good (the screen is finished, not just rotated). Uses `Dispatchers.Main.immediate` + a `SupervisorJob`. This is where most app coroutines live, since the ViewModel survives configuration changes.
- **`lifecycleScope`** - an extension on a `LifecycleOwner` (Activity/Fragment). Cancelled when the lifecycle reaches **`DESTROYED`**. Use sparingly - for UI-only work that genuinely must follow the view, not the data.

```kotlin
class FeedViewModel : ViewModel() {
    fun refresh() = viewModelScope.launch {     // cancelled in onCleared()
        _state.value = repo.load()
    }
}
```

**Why this matters:** before these existed, you manually cancelled jobs in `onDestroy`/`onCleared` - easy to forget, causing leaks and callbacks firing on dead screens. Structured concurrency + lifecycle scopes make that automatic.

**Gotchas:**
- Don't run **data** work in `lifecycleScope` - on rotation the Activity is destroyed and the work is cancelled and restarted. Put it in the ViewModel.
- **`GlobalScope`** is *not* lifecycle-aware - coroutines launched there outlive everything and leak. Avoid it.
- For collecting flows in the UI, pair `lifecycleScope` with **`repeatOnLifecycle(STARTED)`** so collection pauses in the background.
