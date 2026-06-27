---
question: "What can the when expression do beyond a switch statement?"
topic: kotlin
difficulty: junior
order: 50
starred: false
section: "Language essentials"
tags: ["kotlin", "when", "control-flow"]
---

`when` is far more capable than Java's `switch`. As an **expression** it returns a value, and it can branch on conditions, not just constants.

```kotlin
// As an expression with ranges, types, and multiple values
val label = when (score) {
    in 90..100 -> "A"
    in 70..89  -> "B"
    50, 51, 52 -> "borderline"
    else       -> "F"
}

// Type checks with smart cast
when (x) {
    is String -> x.length
    is List<*> -> x.size
    else -> 0
}

// No subject: acts like an if/else-if chain
when {
    user == null   -> showLogin()
    user.isAdmin   -> showAdmin()
    else           -> showHome()
}
```

Key abilities to mention:
- **Exhaustiveness** - when used as an expression on a `sealed` type or `enum`, the compiler requires all cases (no `else` needed), and errors if you miss one later.
- **Smart casts** inside `is` branches.
- **Ranges and collections** with `in`.
- **Capturing the subject**: `when (val r = compute()) { ... }`.

**Interview note:** prefer `when` as an *expression* returning a value over mutating a variable in branches - it's more idiomatic and the exhaustiveness check protects you.
