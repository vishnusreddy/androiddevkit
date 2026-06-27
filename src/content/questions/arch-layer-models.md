---
question: "Should the network, database, domain, and UI use separate models?"
topic: architecture
difficulty: senior
tags: ["models", "mapping", "clean-architecture", "layers"]
---

In a layered architecture, the same concept ("User") often has **separate models per layer**, with **mappers** at the boundaries:

- **DTO (network)** - shape of the API response. Has serialization annotations (`@SerializedName`), nullable fields, server quirks.
- **Entity (database)** - Room `@Entity`; has DB concerns (`@PrimaryKey`, column info, denormalization).
- **Domain model** - clean Kotlin used by use cases/business logic. No framework annotations.
- **UI model** - pre-formatted for display (e.g. `"3h ago"` instead of a timestamp, a resolved color/label).

```kotlin
fun UserDto.toDomain() = User(id = id, name = name ?: "Unknown")
fun User.toUi() = UserUiModel(name = name, initials = name.take(2).uppercase())
```

**Why separate them:**
- **Decoupling** - a backend field rename only touches the DTO + its mapper, not the whole app. The UI doesn't break because the API changed.
- **Each layer models its own concerns** - nullability/serialization at the edge, clean types in the middle, display-ready in the UI.
- **Testability & clarity** - domain logic works on clean models without server cruft.

**The pragmatic counterpoint (interviewers reward this balance):**
- For a **simple app**, 3–4 models + mappers per entity is **massive boilerplate** for little gain. It's fine to share a single model across layers when the app is small and the API maps cleanly to the UI.
- Introduce separate models **where the friction is real** - e.g. when the API is messy, when one screen aggregates several sources, or when domain logic shouldn't see serialization details. Don't apply it dogmatically everywhere.

**Where mapping lives:** typically in the **data layer** (DTO/Entity → Domain) and **presentation layer** (Domain → UI), often as extension functions or dedicated `Mapper` classes (easy to unit-test).
