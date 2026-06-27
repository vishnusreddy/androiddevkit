---
question: "How do generic type constraints work in Kotlin?"
topic: kotlin
difficulty: senior
order: 10
starred: false
section: "Type system and generics"
tags: ["kotlin", "generics", "bounds"]
---

A **type bound** restricts what a type parameter can be. The default upper bound is `Any?` (anything, including null).

```kotlin
// Single upper bound: T must be Comparable<T>
fun <T : Comparable<T>> max(a: T, b: T): T = if (a > b) a else b

// Non-null bound - T can't be nullable
fun <T : Any> requireValue(x: T?): T = x ?: error("null")
```

For **multiple bounds**, use a `where` clause:

```kotlin
fun <T> copyWhenReady(source: T, dest: T)
    where T : CharSequence,
          T : Appendable {
    // T is guaranteed to be both CharSequence and Appendable
}
```

Points interviewers check:
- An unbounded `<T>` defaults to `T : Any?`, so `T` may be nullable - bound it with `: Any` if you need non-null.
- Bounds are how you call methods on a generic type: `max` above can use `>` only because `T : Comparable<T>`.
- Combine with variance: `class Box<out T : Number>` is a covariant box constrained to numbers.
- Don't confuse a **bound** (`T : Number`, constrains the type) with **variance** (`out T`, constrains assignability).

**Practical use:** generic repositories/adapters (`<T : Entity>`), or a Compose `AnimateAsState`-style helper bounded to types it can interpolate.
