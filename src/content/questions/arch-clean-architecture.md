---
question: "Explain Clean Architecture on Android. What are the layers and the dependency rule?"
topic: architecture
difficulty: mid
tags: ["clean-architecture", "layers", "separation"]
---

Clean Architecture separates code by responsibility. The useful part is not the
diagram or the number of layers. It is keeping business rules independent from
Android UI and storage details.

On Android this typically maps to three layers (Google's recommended architecture):

- **Data layer** - repositories and their data sources (network, database, cache). Owns *how* data is fetched/stored. Exposes data to the domain/UI.
- **Domain layer** (optional) - pure business logic: **use cases** and domain models. **No Android dependencies** - plain Kotlin, fully testable. Defines repository **interfaces**.
- **UI (presentation) layer** - ViewModels + Compose/Views. Holds UI state, reacts to user input, observes data.

```
UI  ──depends on──▶  Domain  ◀──depends on──  Data
(ViewModel)          (UseCase,                (Repository impl,
                      interfaces)              network, db)
```

**The dependency rule in practice:** a domain layer can define a
`UserRepository` interface and the data layer can implement it. Business logic
then knows it can load a user, but does not know whether the data came from Room,
Retrofit, or a fake used in a test.

**Why teams use it:**
- **Testability** - domain logic is pure Kotlin, tested without Android.
- **Replaceability** - change a data source without rewriting the UI.
- **Separation of concerns** - each layer has one reason to change.

**Keep it practical:**
- The **domain layer is optional** - for simple screens, ViewModel → Repository is fine; add use cases when business logic is **reused** across ViewModels or gets complex.
- Don't over-engineer: mapping models across three layers and a use case per call can be **overkill** for a CRUD app. Match the architecture to the app's complexity.
- Separate models can protect layers from each other's changes, but mapping every
  small object through four representations is not automatically better.
