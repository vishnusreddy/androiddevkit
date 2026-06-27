---
question: "What are higher-order functions and function types in Kotlin?"
topic: kotlin
difficulty: junior
tags: ["kotlin", "lambdas", "functional"]
---

A **higher-order function** takes a function as a parameter and/or returns one. Functions are first-class values, with types like `(Int) -> String` or `(T) -> Unit`.

```kotlin
fun <T> List<T>.customFilter(predicate: (T) -> Boolean): List<T> {
    val result = mutableListOf<T>()
    for (item in this) if (predicate(item)) result.add(item)
    return result
}

val evens = listOf(1, 2, 3, 4).customFilter { it % 2 == 0 }
```

Worth knowing:
- **Trailing lambda syntax** - if the last parameter is a function, you can move the lambda outside the parentheses: `customFilter { it > 0 }`.
- **`it`** is the implicit name for a single-parameter lambda.
- **Function references** - pass an existing function with `::`: `list.filter(::isValid)`.
- A lambda is compiled to a **`Function` object** (allocation) unless the function is `inline`.

This is the backbone of the Kotlin stdlib (`map`, `filter`, `forEach`) and of idiomatic APIs like Compose and coroutine builders.
