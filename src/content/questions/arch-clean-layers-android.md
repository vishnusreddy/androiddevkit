---
question: "How do the classic Clean Architecture layers map to Android?"
topic: architecture
difficulty: mid
order: 32
starred: false
section: "Architecture foundations"
tags: ["clean-architecture", "layers", "domain", "data", "presentation"]
---

The classic circles describe dependency direction, not mandatory package names.
A practical Android mapping is:

**Entities or enterprise rules:** stable business concepts and invariants, such
as `Money`, `Order`, or eligibility rules. They should not depend on Android,
Room, Retrofit, or UI models.

**Use cases or application rules:** operations the application supports, such as
`PlaceOrder`, `ObserveFeed`, or `ChangeSubscription`. They coordinate domain
rules and ports, and expose an API suitable for presentation or other entry
points.

**Interface adapters:** ViewModels, presenters, repository implementations, and
mappers. They translate between the shapes expected by inner policy and outer
frameworks.

**Frameworks and drivers:** Compose, Activities, Room, Retrofit, WorkManager,
FCM, and the Android framework. These are replaceable details at the outside.

![Clean Architecture dependency rule on Android](/diagrams/clean-architecture.svg)

The dependency rule says outer code can depend inward. Inner policy must not
import an outer framework. Data may implement an interface owned by domain, and
DI connects that implementation at the application boundary.

Not every app needs all four circles as Gradle modules. Small applications can
keep UI and data packages in one module while following the same dependency
discipline. Create a module boundary when independent compilation,
encapsulation, ownership, or reuse pays for the extra wiring.

Also distinguish this from Google's recommended architecture. Both encourage
separation and testability, but Google's guidance does not require every
repository interface to be owned by a domain module.
