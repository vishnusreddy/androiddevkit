---
question: "What is SavedStateHandle, and how does it fit the architecture?"
topic: architecture
difficulty: mid
order: 90
starred: false
section: "Presentation and state"
tags: ["savedstatehandle", "viewmodel", "state"]
---

`SavedStateHandle` is a **key-value state container provided to a ViewModel**.
It keeps values across configuration changes and can restore them after
system-initiated process death while the navigation entry or task is retained.
It is for the small amount of transient state needed to reconstruct a screen,
not for state that must outlive task dismissal or a force-stop.

**Two main jobs:**

**1. Receive navigation arguments** - Hilt/Navigation populate it from the back stack, so a ViewModel reads its args without the UI passing them in:
```kotlin
@HiltViewModel
class DetailViewModel @Inject constructor(
    handle: SavedStateHandle,
    repo: ItemRepository,
) : ViewModel() {
    private val itemId: String = requireNotNull(handle["itemId"]) {
        "Detail requires an itemId navigation argument"
    }
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
- It replaces much of the manual `onSaveInstanceState` plumbing for state used
  by ViewModel logic. Purely visual element state can still belong in the UI's
  own saveable-state mechanism.
- Values must be **`Bundle`-able** (primitives, `Parcelable`) and kept **small** - it's for identifiers and UI state, not large data (re-fetch big data from the repository on restore).

**Why it's preferred over assisted injection for nav args:** Navigation already serializes args into the saved state, so Hilt can populate `SavedStateHandle` automatically - no custom `@AssistedFactory` needed.
