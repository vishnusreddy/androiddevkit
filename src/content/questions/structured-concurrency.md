---
question: "Explain structured concurrency. Why does it matter on Android?"
topic: coroutines
difficulty: mid
tags: ["coroutines", "scopes", "cancellation"]
---

Structured concurrency means **every coroutine runs inside a scope, and a scope doesn't finish until all the coroutines it launched have finished**. Coroutines form a parent–child tree.

This gives you three guarantees:

1. **No leaks.** A coroutine can't outlive its scope. When the scope is cancelled, all children are cancelled.
2. **Cancellation propagates.** Cancelling a parent cancels its children; a failing child (by default) cancels its siblings and parent.
3. **Errors aren't lost.** Exceptions surface to the scope rather than vanishing on some detached thread.

**Why it matters on Android:** `viewModelScope` is cancelled in `onCleared()`, and `lifecycleScope` follows the lifecycle. Tie your coroutines to these and work is automatically cancelled when the user leaves — no manual teardown, no callbacks firing on a dead screen.

```kotlin
class FeedViewModel : ViewModel() {
    fun refresh() = viewModelScope.launch {
        val items = repo.loadFeed()   // cancelled automatically if the
        _state.value = State.Loaded(items) // ViewModel is cleared mid-flight
    }
}
```

**Follow-up to be ready for:** use `supervisorScope` (or a `SupervisorJob`) when you *don't* want one child's failure to cancel its siblings — e.g. loading several independent widgets where one failing shouldn't blank the rest.
