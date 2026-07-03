---
question: "MVC vs MVP vs MVVM - how did Android presentation patterns evolve?"
topic: architecture
difficulty: mid
order: 40
starred: false
section: "Presentation and state"
tags: ["mvp", "mvvm", "mvc", "presentation"]
---

All separate UI from logic; they differ in **how** the logic talks to the view.

**MVC (Model-View-Controller)** - on Android, the Activity/Fragment often ended up as both View *and* Controller ("Massive View Controller"). Poor separation; hard to test because logic was tangled with framework classes.

**MVP (Model-View-Presenter):**
- The **View** (Activity/Fragment) implements a `View` **interface** and is passive.
- The **Presenter** holds the logic, calls **back into the view** through that interface (`view.showLoading()`, `view.showError()`).
- **Strengths:** clear separation and a presenter that can be tested through a
  view interface.
- **Costs:** verbose view contracts, manual attach and detach handling, and no
  built-in survival across configuration changes.

**MVVM (Model-View-ViewModel):**
- The **ViewModel** exposes **observable state** (`StateFlow`/`LiveData`); it does **not** reference the view.
- The **View observes** state and renders it (reactive, UDF).
- **Strengths:** a Jetpack `ViewModel` does not hold the view, survives
  configuration changes, and exposes observable state naturally to Compose or
  Views. Modern Android guidance favors this state-holder approach.

**The key shift:** MVP **pushes** to the view via an interface (imperative, two-way coupling); MVVM has the view **pull/observe** state (reactive, one-way). MVVM's lack of a view reference is what fixes MVP's leak and lifecycle pain.

![Comparison of MVP presenter calls and MVVM observable state](/diagrams/mvp-vs-mvvm.svg)
