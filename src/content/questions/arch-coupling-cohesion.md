---
question: "What are coupling and cohesion, and why do they matter?"
topic: architecture
difficulty: mid
tags: ["design-principles", "coupling", "cohesion"]
---

Two measures of code quality that good architecture optimizes in opposite directions: **low coupling, high cohesion**.

**Coupling** — how much one module **depends on** another. **Low (loose) coupling** is the goal: modules interact through small, stable interfaces, so a change in one doesn't ripple into many others.
- *Tightly coupled:* a ViewModel directly instantiating `RetrofitClient` and `RoomDatabase` — changing either breaks the ViewModel.
- *Loosely coupled:* the ViewModel depends on a `Repository` **interface**, injected. Swap the implementation freely.

**Cohesion** — how **focused** a module is; how strongly its parts relate to a single purpose. **High cohesion** is the goal: a class does one well-defined job.
- *Low cohesion:* a `Utils` class with networking, date formatting, and bitmap helpers thrown together.
- *High cohesion:* a `DateFormatter` that only formats dates; a `FeedRepository` that only handles feed data.

**Why they matter:**
- **Maintainability** — loosely coupled, highly cohesive code is easier to change: edits stay local, and each class is easy to understand.
- **Testability** — low coupling lets you inject fakes; high cohesion means small, focused units to test.
- **Reusability** — focused modules are reusable; tangled ones aren't.

**How Android practices achieve them:**
- **DI + interfaces** → low coupling (depend on abstractions).
- **Single Responsibility / layering** → high cohesion (each class/layer one job).
- **Modularization** → enforces boundaries (low coupling between features).
- **UDF** → the UI depends on state, not on the ViewModel's internals.

These two are the *why* behind SOLID, Clean Architecture, and DI — interviewers like seeing you connect the principle to the practice.

**Soundbite:** "Coupling = inter-module dependency (want it low, via interfaces/DI); cohesion = how focused a module is (want it high, via single responsibility). Low coupling + high cohesion = maintainable, testable, reusable code — the goal behind SOLID, layering, and modularization."
