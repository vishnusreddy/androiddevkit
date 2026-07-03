---
question: "Explain Clean Architecture on Android. What are the layers and the dependency rule?"
topic: architecture
difficulty: mid
order: 30
starred: true
section: "Architecture foundations"
tags: ["clean-architecture", "layers", "separation"]
---

Clean Architecture protects high-level policy from volatile details. The useful
idea is the **dependency rule**: source-code dependencies point toward stable
business rules, while UI, database, and network code remain replaceable details.

A strict Android interpretation often uses:

- **Domain** - business entities, use cases, and ports such as repository
  interfaces. It is plain Kotlin and does not know about Android, Retrofit, or
  Room.
- **Data** - implements domain ports using network, database, cache, and mappers.
- **Presentation** - ViewModels and UI translate user actions and domain results
  into UI state.

![Clean Architecture dependency rule with presentation and data depending on domain policy](/diagrams/clean-architecture.svg)

For example, the domain can define `UserRepository`, and the data module can
implement it. Business logic knows that users can be loaded but does not know
whether the implementation uses Room, HTTP, or a test fake. DI wires the
implementation at the application boundary.

**Why teams use it:**
- **Testability** - business rules can run without Android or I/O.
- **Replaceability** - volatile details can change behind stable ports.
- **Independent evolution** - teams can enforce boundaries with Gradle modules.

**Keep it practical:**
- Google's recommended layered architecture and strict Clean Architecture are
  compatible in goals, but they are not identical dependency diagrams. Google's
  guidance does not require repository interfaces to live in a domain module.
- For a simple app, ViewModel to repository is often enough. A use case that only
  forwards one call adds a name but no policy.
- Separate models when they protect a meaningful boundary. Mapping every field
  through several identical models is not automatically cleaner.

A strong answer names which business rules need protection, which details are
likely to change, and why the extra boundaries are worth their maintenance cost.
