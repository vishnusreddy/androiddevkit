---
question: "Walk through MVVM data flow in a modern Android app."
topic: architecture
difficulty: junior
order: 35
starred: true
section: "Presentation and state"
tags: ["mvvm", "viewmodel", "stateflow", "repository", "udf"]
---

MVVM separates rendering, screen state, and application data. On modern Android,
it usually works as a unidirectional loop rather than two-way data binding.

![MVVM data flow between UI, ViewModel, and repository](/diagrams/udf-loop.svg)

**View:** a composable, Activity, or Fragment renders `UiState` and forwards user
actions. It owns UI-only behavior such as focus, animation, and executing
navigation.

**ViewModel:** a screen-level state holder. It accepts actions, coordinates use
cases or repositories, and exposes immutable observable state. It must not hold
a View, Activity, Fragment, or Activity-scoped `Context`.

**Model:** not one class. It is the application data and rules exposed through
repositories or use cases. Network DTOs and Room entities are data-source
details, not the ViewModel's public model by default.

A typical refresh follows this sequence:

1. The user pulls to refresh and the UI calls `viewModel.refresh()`.
2. The ViewModel marks refresh as active and calls the repository.
3. The repository fetches or synchronizes data and updates its source of truth.
4. Repository data emits again.
5. The ViewModel combines that data with screen inputs to produce a new
   immutable `UiState`.
6. The UI renders the state.

MVVM does not automatically guarantee good architecture. A ViewModel that owns
Retrofit, SQL, navigation, and fifty mutable fields is still tightly coupled.
The useful properties are clear ownership, one source of truth, lifecycle-aware
collection, and state that can be tested without constructing the UI.

A ViewModel survives configuration changes. It does not survive process death.
Use `SavedStateHandle` for small restorable inputs and persistent storage for
durable user data.
