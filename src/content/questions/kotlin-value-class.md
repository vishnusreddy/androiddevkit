---
question: "What is a value class (inline class) and when would you use it?"
topic: kotlin
difficulty: mid
order: 190
starred: false
section: "Classes and modeling"
tags: ["kotlin", "value-class", "performance"]
---

A `value class` (formerly `inline class`) wraps a single value to give it a **distinct type**, but the compiler **inlines** the underlying value at runtime - so you get type safety with (usually) no allocation overhead.

```kotlin
@JvmInline
value class UserId(val value: String)
@JvmInline
value class Email(val value: String)

fun fetch(id: UserId) { /* ... */ }

fetch(UserId("u123"))   // type-safe
// fetch(Email("a@b.c")) // compile error - can't mix them up
```

At runtime `UserId` is represented as a plain `String` wherever possible - no wrapper object is created.

**Why use it:**
- **Prevent primitive obsession / mix-ups** - a function taking `UserId`, `Email`, and `Meters` can't have its arguments swapped, unlike three `String`s.
- **Domain modeling** without the cost of a real wrapper class.

**Rules & caveats:**
- Exactly **one** property in the primary constructor.
- Can have methods and computed properties, but **no `init` backing fields** beyond that one value.
- It gets **boxed** (allocated) when used as a nullable, as a generic type argument, or where its supertype is expected - so the "zero-cost" benefit isn't guaranteed in every position.
