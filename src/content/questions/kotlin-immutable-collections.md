---
question: "Is Kotlin's List truly immutable? Read-only vs immutable collections."
topic: kotlin
difficulty: mid
order: 80
starred: false
section: "Collections"
tags: ["kotlin", "collections", "immutability"]
---

No - `List` is **read-only, not immutable**. The `List` interface simply *doesn't expose* mutating methods like `add`/`remove`; it doesn't guarantee the underlying data can't change.

Two ways that bites you:

**1. The same object can be referenced as both types.**
```kotlin
val mutable = mutableListOf(1, 2, 3)
val readOnly: List<Int> = mutable   // same backing object
mutable.add(4)
println(readOnly)   // [1, 2, 3, 4]  - it changed under you
```

**2. A `List` can be cast back (it's often an `ArrayList` at runtime).**

So `List` protects *your* code from calling mutators, but it's not a deep immutability guarantee.

**For real immutability**, use the **kotlinx.collections.immutable** library: `ImmutableList` / `persistentListOf()`. These genuinely can't be mutated and are also recognized as **stable** by the Compose compiler, which helps skip recomposition.

```kotlin
val items: ImmutableList<Item> = persistentListOf(a, b, c)
```
