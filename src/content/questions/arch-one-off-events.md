---
question: "How should a ViewModel represent UI state and one-time events?"
topic: architecture
difficulty: mid
order: 80
starred: true
section: "Presentation and state"
tags: ["events", "state", "sharedflow", "udf"]
---

Start by separating **input events** from **state changes**. A tap is an event.
Submitting an order is an action. "Order submitted" is a fact that should be
represented in state or durable data. Navigation and a snackbar are UI reactions
to those facts.

For navigation caused entirely by a UI action, the UI can often navigate
directly. If navigation depends on business work, let the ViewModel expose the
result as state and let the UI react:

```kotlin
data class CheckoutUiState(
    val submitting: Boolean = false,
    val completedOrderId: String? = null,
    val userMessage: UserMessage? = null,
)

// UI
LaunchedEffect(state.completedOrderId) {
    state.completedOrderId?.let { id ->
        navigateToConfirmation(id)
        viewModel.onOrderNavigationHandled(id)
    }
}
```

The acknowledgement should include the value or ID being handled so it cannot
accidentally clear a newer result. Model a queue in state if several user
messages can be pending. Persist the underlying fact when it must survive
process death, rather than trying to make UI delivery itself durable.

`Channel` and `SharedFlow(replay = 0)` remain useful for best-effort signals, but
know their contract:

- A zero-replay `SharedFlow` can drop an emission when there is no subscriber.
- A buffered `Channel` can retain a limited number of elements for one receiver,
  but it does not survive process death.
- Neither creates end-to-end exactly-once behavior across lifecycle changes.

Use them only when losing the signal while the UI is absent is acceptable, or
when the surrounding design supplies acknowledgement and durability.

**What to avoid:**
- Treating navigation as a fire-and-forget ViewModel command with no state or acknowledgement.
- `SingleLiveEvent` and generic event-wrapper types that hide delivery semantics.
- Storing a lambda, `NavController`, `Context`, or UI object in the ViewModel.

The strongest interview answer defines the required delivery semantics first.
User-visible business outcomes belong in state or storage. Ephemeral UI effects
are reactions to those outcomes, not a second source of truth.
