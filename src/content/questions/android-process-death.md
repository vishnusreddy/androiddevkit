---
question: "How is process death different from a configuration change?"
topic: android-fundamentals
difficulty: mid
tags: ["lifecycle", "process-death", "savedstate", "viewmodel"]
---

Two different ways your UI state can be destroyed - and they need different tools.

**Configuration change** (rotation, locale, dark mode, multi-window): the system **destroys and recreates the Activity** immediately, but the **process stays alive**. So in-memory objects that survive recreation are intact.
- **Handled by `ViewModel`** - it survives config changes (it's retained across the recreate), so your data and in-flight coroutines aren't lost.

**Process death** (the system reclaims your app's memory while it is in the
background): the **entire process is killed**. The ViewModel, static fields,
singletons - **everything in memory is gone**. When the user returns through the
retained task, Android creates a new process and Activity and can restore saved
UI state.
- Use **saved state** - `onSaveInstanceState`, `rememberSaveable`, or
  `SavedStateHandle` - for small transient values needed to reconstruct the
  screen. Android keeps that serialized state outside your process; it is not a
  durable database and is cleared when the user fully dismisses the task.
- Use **local persistence** such as Room or DataStore for application data that
  must survive process death, task dismissal, and later app launches.

```kotlin
class SearchViewModel(private val handle: SavedStateHandle) : ViewModel() {
    // Survives BOTH config change AND process death
    val query: StateFlow<String> = handle.getStateFlow("query", "")
    fun setQuery(q: String) { handle["query"] = q }
}
```


| | Config change | Process death |
|---|---|---|
| Process | survives | killed |
| ViewModel | survives | **lost** |
| `SavedStateHandle` / saved-state `Bundle` | survives | **restored after system-initiated death** |

**Rules:**
- Put **screen data and ongoing work** in the ViewModel (handles config changes for free).
- Put **small, essential UI state** (a query, scroll position, selected tab) in `SavedStateHandle`/`rememberSaveable` so it survives process death too.
- Keep saved state **small** - the Bundle is for identifiers and UI state, not large data. Re-fetch big data from a repository on restore.
- **Test configuration recreation** with "Don't keep activities." Test actual
  process death separately - for example, background the app and use
  `adb shell am kill <package>` - because destroying Activities is not the same
  event as killing the process.
