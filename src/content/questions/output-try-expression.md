---
question: "What value does a Kotlin try expression return, and what does finally change?"
topic: code-snippet-output
difficulty: mid
order: 20
starred: true
section: "Control flow"
tags: ["kotlin", "output-based", "exceptions", "expressions"]
---

```kotlin
fun parse(value: String): Int {
    return try {
        println("try")
        value.toInt()
    } catch (e: NumberFormatException) {
        println("catch")
        -1
    } finally {
        println("finally")
    }
}

println(parse("x"))
```

**Output:**

```text
try
catch
finally
-1
```

`try` is an expression in Kotlin. Because parsing throws, the `catch` block's
last expression, `-1`, becomes the result. The `finally` block still runs before
the function returns, but its value is ignored.

A `return` or `throw` inside `finally` would override the earlier result. That
is legal, but it hides control flow and is best avoided.

**How to reason about it:** choose either the successful `try` path or a matching
`catch` path, record its result, run `finally`, and then return the recorded
result unless `finally` exits abruptly.
