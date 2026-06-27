---
question: "What is a ViewModel, how does it survive configuration changes, and what should it not hold?"
topic: android-fundamentals
difficulty: mid
tags: ["viewmodel", "architecture", "lifecycle"]
---

A `ViewModel` holds and manages **UI-related state** and survives configuration changes, so data and in-flight work aren't lost on rotation.

**How it survives:** the ViewModel is stored in a **`ViewModelStore`** owned by the Activity/Fragment/NavBackStackEntry. On a configuration change, the Activity is recreated but its `ViewModelStore` is **retained** (via `onRetainNonConfigurationInstance` internally) and handed to the new instance. So you get the **same** ViewModel back. It's cleared (`onCleared()`) only when the owner is **permanently** gone (finished, popped) — **not** on rotation.

```kotlin
class FeedViewModel(private val repo: FeedRepository) : ViewModel() {
    private val _state = MutableStateFlow(FeedUiState())
    val state = _state.asStateFlow()
    // viewModelScope cancelled in onCleared()
}
```

**What a ViewModel must NOT hold:**
- **`Context` of an Activity, Views, Fragments, or anything view-bound** — these outlive a config change while the ViewModel persists, so holding them **leaks** the old Activity. If you need a context, use `AndroidViewModel`'s **application** context.
- It shouldn't reach *into* the UI; it exposes state the UI observes (one-way).

**Key points:**
- It does **not** survive **process death** — pair with `SavedStateHandle` for state that must.
- **`viewModelScope`** ties coroutines to the ViewModel lifecycle (cancelled in `onCleared`).
- Scope it correctly: `viewModels()` (Activity/Fragment), `activityViewModels()` (share across fragments), or `hiltViewModel()` (per nav destination).
- Construct it with a **factory** (or Hilt) to inject dependencies.

**Soundbite:** "The ViewModel's `ViewModelStore` is retained across recreation, so it survives config changes but not process death; never give it a view or Activity context — that leaks the old Activity."
