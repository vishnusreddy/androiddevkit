---
question: "What is SavedStateHandle, and how does it fit the architecture?"
topic: architecture
difficulty: mid
tags: ["savedstatehandle", "viewmodel", "state"]
---

`SavedStateHandle` is a **key-value map injected into a ViewModel** that survives both **configuration changes** (like the ViewModel) **and process death** (unlike the ViewModel). It's the architectural answer to "small UI state that must outlive everything."

**Two main jobs:**

**1. Receive navigation arguments** - Hilt/Navigation populate it from the back stack, so a ViewModel reads its args without the UI passing them in:
```kotlin
@HiltViewModel
class DetailViewModel @Inject constructor(
    handle: SavedStateHandle,
    repo: ItemRepository,
) : ViewModel() {
    private val itemId: String = handle["itemId"]!!   // nav arg
    val item = repo.observe(itemId).stateIn(...)
}
```

**2. Persist transient UI state across process death** - query text, selected tab, scroll target:
```kotlin
val query: StateFlow<String> = handle.getStateFlow("query", "")
fun setQuery(q: String) { handle["query"] = q }
```

**Where it fits:**
- It bridges the gap the **ViewModel can't** cover (process death). The ViewModel handles config changes; `SavedStateHandle` extends that to process death for the few keys that matter.
- It replaces manual `onSaveInstanceState` plumbing in the Activity/Fragment - the state lives **in the ViewModel** where the logic is, not in the view.
- Values must be **`Bundle`-able** (primitives, `Parcelable`) and kept **small** - it's for identifiers and UI state, not large data (re-fetch big data from the repository on restore).

**Why it's preferred over assisted injection for nav args:** Navigation already serializes args into the saved state, so Hilt can populate `SavedStateHandle` automatically - no custom `@AssistedFactory` needed.
