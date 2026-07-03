---
question: "What belongs in a ViewModel, and what should stay out of it?"
topic: architecture
difficulty: mid
order: 65
starred: true
section: "Presentation and state"
tags: ["viewmodel", "ui-state", "architecture", "lifecycle"]
---

A `ViewModel` is a **screen-level state holder**. It turns application data and
user events into UI state, and it survives configuration changes. It is not a
place for every piece of code that does not fit in the Activity.

**Good ViewModel responsibilities:**

- Expose immutable `UiState`, usually as `StateFlow`.
- Accept user events such as refresh, retry, or item selection.
- Coordinate repositories or use cases needed by that screen.
- Apply presentation decisions that do not require UI objects, such as deciding
  whether an empty state or retry action should be visible.
- Save small, restorable screen inputs in `SavedStateHandle`, such as an item ID,
  query, or selected tab.

**Keep these outside:**

- Composables, Views, `Activity`, `Fragment`, or an Activity-scoped `Context`.
- Navigation execution, showing a toast, requesting focus, and other UI actions.
  The ViewModel can expose the decision; the UI performs it.
- Network, SQL, cache, and sync policies. Repositories own data orchestration.
- Reusable business rules. Put substantial or shared rules in a use case or the
  data layer, depending on ownership.
- Large mutable graphs or data that should be restored after process death.

```kotlin
data class CheckoutUiState(
    val items: List<CartItem> = emptyList(),
    val isSubmitting: Boolean = false,
    val error: UserMessage? = null,
)

class CheckoutViewModel(
    private val checkout: SubmitOrder,
    savedStateHandle: SavedStateHandle,
) : ViewModel() {
    val cartId: String = checkNotNull(savedStateHandle["cartId"])
    // State production and user-event handling live here.
}
```

A useful review question is: **could this ViewModel be tested with plain inputs
and fake dependencies, without constructing UI objects?** If not, a boundary is
probably misplaced. Also remember that a ViewModel survives rotation, not
process death. Durable data belongs in storage, and restorable inputs belong in
saved state.
