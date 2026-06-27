---
question: "Explain Unit, Nothing, and Any. How do they differ?"
topic: kotlin
difficulty: mid
tags: ["kotlin", "type-system"]
---

These sit at the edges of Kotlin's type hierarchy.

**`Any`** — the **root** of all non-nullable types (like Java's `Object`). Everything is an `Any`; `Any?` is the absolute top including null. It declares `equals`, `hashCode`, `toString`.

**`Unit`** — the type of functions that return "nothing meaningful," equivalent to `void`, except `Unit` is a **real type with a single value** (`Unit`). That matters because generics need an actual type: `Callback<Unit>` works, `Callback<void>` couldn't.

**`Nothing`** — the **bottom** type: it has **no instances** and is a subtype of *every* type. A function returning `Nothing` never returns normally — it always throws or loops forever.
```kotlin
fun fail(msg: String): Nothing = throw IllegalStateException(msg)

val name = user.name ?: fail("no name")  // compiler knows name is non-null after
```

Because `Nothing` is a subtype of everything, the compiler uses it for control flow: `throw` and `TODO()` have type `Nothing`, so they fit into any expression. `emptyList()` returns `List<Nothing>`, which is assignable to `List<anything>`.

**Summary:** `Any` = top (every value), `Nothing` = bottom (no value), `Unit` = "returns, but no useful value."
