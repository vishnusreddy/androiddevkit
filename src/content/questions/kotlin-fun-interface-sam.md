---
question: "What is a functional (SAM) interface, and what is SAM conversion?"
topic: kotlin
difficulty: mid
tags: ["kotlin", "fun-interface", "sam", "interop"]
---

A **functional interface** has exactly **one abstract method** (Single Abstract Method). Mark it `fun interface` and Kotlin lets you implement it with a **lambda** instead of an object expression — that substitution is **SAM conversion**.

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}

// SAM conversion: lambda becomes an IntPredicate
val isEven = IntPredicate { it % 2 == 0 }
isEven.accept(4)   // true
```

Without `fun interface` you'd have to write:
```kotlin
val isEven = object : IntPredicate {
    override fun accept(i: Int) = i % 2 == 0
}
```

**Key points:**
- SAM conversion works automatically for **Java** interfaces (`Runnable`, `OnClickListener`, `Comparator`) — that's why `view.setOnClickListener { }` works.
- For **Kotlin** interfaces it only kicks in with the `fun interface` keyword; otherwise the compiler prefers you use a function type (`(Int) -> Boolean`) directly.
- A `fun interface` can have other non-abstract (default) members, just one abstract one.

**When to prefer `fun interface` over a `typealias` for a function type:** when you want a named type with possible default methods, nominal typing, or Java interop — a plain `(Int) -> Boolean` is structural and can't carry extra members.
