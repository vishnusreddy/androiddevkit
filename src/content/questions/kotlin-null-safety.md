---
question: "How does Kotlin's null safety work, and what does !! actually do?"
topic: kotlin
difficulty: junior
tags: ["kotlin", "null-safety"]
---

Kotlin encodes nullability in the **type system**. `String` can never be null; `String?` can. The compiler forces you to handle the nullable case before you can dereference it, which eliminates most `NullPointerException`s at compile time.

The main tools:

- **Safe call `?.`** - returns `null` instead of throwing if the receiver is null: `user?.name`.
- **Elvis `?:`** - supply a fallback: `user?.name ?: "Guest"`.
- **Smart casts** - after a `!= null` check, the compiler treats the variable as non-null inside that block.
- **`!!` (not-null assertion)** - tells the compiler "trust me, this isn't null." If it *is*, it throws an NPE. It's an escape hatch that throws away the guarantee you came for.

```kotlin
val length = name?.length ?: 0   // safe
val length = name!!.length       // throws if name is null
```

**Practical guidance:** `!!` is a code smell - reserve it for genuine impossibilities, and prefer `?.`, `?:`, `requireNotNull()` (which throws a *meaningful* message), or restructuring so the value can't be null. Also mention **platform types** (`String!`) from Java interop: the compiler can't verify them, so annotate Java APIs or null-check at the boundary.
