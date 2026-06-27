---
question: "What is process death, and how is it different from a configuration change? How do you handle each?"
topic: android-fundamentals
difficulty: senior
tags: ["lifecycle", "process-death", "savedstate", "viewmodel"]
---

Two different ways your UI state can be destroyed — and they need different tools.

**Configuration change** (rotation, locale, dark mode, multi-window): the system **destroys and recreates the Activity** immediately, but the **process stays alive**. So in-memory objects that survive recreation are intact.
- **Handled by `ViewModel`** — it survives config changes (it's retained across the recreate), so your data and in-flight coroutines aren't lost.

**Process death** (system reclaims your app's memory while it's in the background): the **entire process is killed**. The ViewModel, static fields, singletons — **everything in memory is gone**. When the user returns, the OS recreates the Activity (and process) and expects you to **restore** the prior UI state.
- **Handled by saved instance state** — `onSaveInstanceState(Bundle)` / `rememberSaveable` / **`SavedStateHandle`**. This is the *only* state that survives process death, because it's serialized to disk by the system.

```kotlin
class SearchViewModel(private val handle: SavedStateHandle) : ViewModel() {
    // Survives BOTH config change AND process death
    val query: StateFlow<String> = handle.getStateFlow("query", "")
    fun setQuery(q: String) { handle["query"] = q }
}
```

**The mental model:**

| | Config change | Process death |
|---|---|---|
| Process | survives | killed |
| ViewModel | survives | **lost** |
| `SavedStateHandle` / `Bundle` | survives | **survives** |

**Rules:**
- Put **screen data and ongoing work** in the ViewModel (handles config changes for free).
- Put **small, essential UI state** (a query, scroll position, selected tab) in `SavedStateHandle`/`rememberSaveable` so it survives process death too.
- Keep saved state **small** — the Bundle is for identifiers and UI state, not large data. Re-fetch big data from a repository on restore.
- **Test it** with the "Don't keep activities" developer option or `adb shell am kill`.

**Soundbite:** "Config change keeps the process (ViewModel survives); process death kills it (only `SavedStateHandle`/`Bundle` survives). Use the ViewModel for data, `SavedStateHandle` for the few keys you must restore from scratch."
