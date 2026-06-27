---
question: "What is a typealias, and how does it differ from a value class?"
topic: kotlin
difficulty: mid
order: 200
starred: false
section: "Classes and modeling"
tags: ["kotlin", "typealias", "value-class"]
---

A **`typealias`** gives an existing type a new name. It introduces **no new type** - it's a pure compile-time alias, fully interchangeable with the original.

```kotlin
typealias UserId = String
typealias ClickHandler = (View) -> Unit
typealias Headers = Map<String, List<String>>

fun fetch(id: UserId) { }
fetch("u123")                 // a plain String works - same type
```

Use it to shorten verbose generic/function types and improve readability.

**The crucial contrast with `value class`:**

| | `typealias UserId = String` | `value class UserId(val v: String)` |
|---|---|---|
| New distinct type? | No | Yes |
| Type-safe (prevents mixups)? | **No** | **Yes** |
| Runtime cost | None | None (usually inlined) |

```kotlin
typealias Email = String
typealias Name = String
fun send(to: Email, name: Name) {}
send(userName, userEmail)     // compiles! aliases don't stop the swap
```

**So:** reach for `typealias` purely for **readability** of complex types; reach for `value class` when you need the compiler to **enforce** that two same-underlying types can't be confused.
