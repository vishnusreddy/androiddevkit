---
question: "How do you model UI state well? (single state object vs multiple flows, sealed vs data class)"
topic: architecture
difficulty: senior
tags: ["state", "ui-state", "sealed-class"]
---

Two common approaches, each with a place:

**1. Single immutable `data class` of nullable/boolean fields** — flexible; can represent overlapping conditions (loading *while* showing stale content).
```kotlin
data class FeedUiState(
    val isLoading: Boolean = false,
    val items: List<Post> = emptyList(),
    val errorMessage: String? = null,
    val isRefreshing: Boolean = false,
)
```

**2. Sealed hierarchy of mutually-exclusive states** — clearer when the screen is in exactly one state at a time, with **exhaustive `when`**.
```kotlin
sealed interface FeedUiState {
    data object Loading : FeedUiState
    data class Success(val items: List<Post>, val refreshing: Boolean) : FeedUiState
    data class Error(val message: String) : FeedUiState
}
```

**How to choose:**
- States are **truly exclusive** (can't be loading and error at once) → **sealed**. Forces you to handle every case.
- States **overlap** (refreshing while content is visible, partial errors) → a **single data class** with flags is more honest than contorting a sealed hierarchy.
- A common hybrid: a `data class` whose fields *include* a sealed `content: ContentState`.

**Principles regardless of shape:**
- **Immutable** — expose a single `StateFlow<UiState>`; update with `copy()` / `update {}`. Never let the UI mutate it.
- **Single source of truth** — one state object the UI renders, not five separate `StateFlow`s that can drift out of sync.
- **Derive, don't duplicate** — compute `showEmptyState` from existing fields rather than storing a redundant flag that can desync.
- **Separate one-off events** (navigation, snackbars) from state so they don't replay on rotation.

**Soundbite:** "Model UI state as a single immutable object the UI renders. Use a sealed hierarchy for mutually-exclusive states (exhaustive `when`), a data class with flags when states overlap; keep it immutable, derive don't duplicate, and split out one-off events."
