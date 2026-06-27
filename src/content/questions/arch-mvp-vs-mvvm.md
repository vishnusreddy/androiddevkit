---
question: "MVC vs MVP vs MVVM - how did Android presentation patterns evolve?"
topic: architecture
difficulty: mid
tags: ["mvp", "mvvm", "mvc", "presentation"]
---

All separate UI from logic; they differ in **how** the logic talks to the view.

**MVC (Model-View-Controller)** - on Android, the Activity/Fragment often ended up as both View *and* Controller ("Massive View Controller"). Poor separation; hard to test because logic was tangled with framework classes.

**MVP (Model-View-Presenter):**
- The **View** (Activity/Fragment) implements a `View` **interface** and is passive.
- The **Presenter** holds the logic, calls **back into the view** through that interface (`view.showLoading()`, `view.showError()`).
- ✅ Testable (mock the view interface), clear separation.
- ❌ **Boilerplate** - a `View` interface with many methods per screen; the Presenter holds a **reference to the view**, so you must detach it (`onDestroy`) to avoid leaks; doesn't survive config changes by itself.

**MVVM (Model-View-ViewModel):**
- The **ViewModel** exposes **observable state** (`StateFlow`/`LiveData`); it does **not** reference the view.
- The **View observes** state and renders it (reactive, UDF).
- ✅ No view reference → no leak, **survives config changes** (Jetpack `ViewModel`), less boilerplate, works naturally with Compose/data binding.
- ✅ The current **recommended** pattern (often refined into MVI).

**The key shift:** MVP **pushes** to the view via an interface (imperative, two-way coupling); MVVM has the view **pull/observe** state (reactive, one-way). MVVM's lack of a view reference is what fixes MVP's leak and lifecycle pain.

```
MVP:  Presenter ──calls──▶ View (interface)      [imperative push]
MVVM: View ──observes──▶ ViewModel (state)        [reactive pull / UDF]
```
