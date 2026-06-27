---
question: "MVVM vs MVI — when would you pick one over the other?"
topic: architecture
difficulty: senior
tags: ["architecture", "mvi", "mvvm", "state"]
---

Both put a state holder between UI and data; they differ in **how state changes flow**.

**MVVM** — the ViewModel exposes several observable properties; the UI observes them and calls methods to mutate them. Simple and familiar, but state can become fragmented across multiple `LiveData`/`StateFlow` fields that can drift out of sync.

**MVI** — there's a **single immutable `UiState`**, and the UI sends **intents/events** that the ViewModel reduces into the next state. Strictly unidirectional: `Intent → reduce → new State → render`.

```kotlin
data class UiState(
    val isLoading: Boolean = false,
    val items: List<Item> = emptyList(),
    val error: String? = null,
)

fun onIntent(intent: Intent) = when (intent) {
    is Intent.Load -> reduce { copy(isLoading = true) }
    // ...
}
```

**Pick MVI when:** the screen has complex, interdependent state; you want every UI state reproducible from a single object (great for testing and time-travel debugging); or a team needs a strict, predictable pattern.

**Pick MVVM when:** the screen is simple — MVI's boilerplate (intents, reducers, single state) isn't worth it for a form with two fields.

**Senior-level nuance to raise:** they're not opposites. A clean "MVVM with a single immutable `StateFlow<UiState>` and event functions" is effectively MVI-lite. What interviewers actually care about is **unidirectional data flow and a single source of truth**, not the acronym. Also mention how you model **one-off events** (navigation, toasts) separately from state so they don't replay on rotation.
