---
question: "Explain Clean Architecture on Android. What are the layers and the dependency rule?"
topic: architecture
difficulty: senior
tags: ["clean-architecture", "layers", "separation"]
---

Clean Architecture organizes code into concentric layers with one inviolable rule: **dependencies point inward**. Inner layers know nothing about outer ones.

On Android this typically maps to three layers (Google's recommended architecture):

- **Data layer** — repositories and their data sources (network, database, cache). Owns *how* data is fetched/stored. Exposes data to the domain/UI.
- **Domain layer** (optional) — pure business logic: **use cases** and domain models. **No Android dependencies** — plain Kotlin, fully testable. Defines repository **interfaces**.
- **UI (presentation) layer** — ViewModels + Compose/Views. Holds UI state, reacts to user input, observes data.

```
UI  ──depends on──▶  Domain  ◀──depends on──  Data
(ViewModel)          (UseCase,                (Repository impl,
                      interfaces)              network, db)
```

**The dependency rule in practice:** the domain defines a `UserRepository` **interface**; the data layer **implements** it. So the inner domain doesn't depend on the outer data layer — the data layer depends *inward* via the interface (**dependency inversion**). The UI depends on the domain abstraction, not concrete implementations.

**Why bother:**
- **Testability** — domain logic is pure Kotlin, tested without Android.
- **Replaceability** — swap a data source (REST → GraphQL) without touching UI/domain.
- **Separation of concerns** — each layer has one reason to change.

**Pragmatism interviewers want to hear:**
- The **domain layer is optional** — for simple screens, ViewModel → Repository is fine; add use cases when business logic is **reused** across ViewModels or gets complex.
- Don't over-engineer: mapping models across three layers and a use case per call can be **overkill** for a CRUD app. Match the architecture to the app's complexity.
- Each layer often has its **own models** (DTO / entity / domain / UI model) with mappers at the boundaries — protects layers from each other's changes, at the cost of boilerplate.

**Soundbite:** "Clean Architecture = UI → Domain ← Data with dependencies pointing inward via interfaces (dependency inversion). Domain is pure, testable Kotlin and optional; apply it proportionally to complexity rather than dogmatically."
