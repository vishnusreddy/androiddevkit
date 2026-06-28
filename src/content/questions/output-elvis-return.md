---
question: "What does return on the right side of the Elvis operator do?"
topic: code-snippet-output
difficulty: junior
order: 20
starred: false
section: "Reading Kotlin"
tags: ["kotlin", "output-based", "null-safety", "elvis"]
---

```kotlin
fun lengthOrZero(text: String?): Int {
    val value = text ?: return 0
    println("measuring")
    return value.length
}

println(lengthOrZero(null))
println(lengthOrZero("cat"))
```

**Output:**

```text
0
measuring
3
```

`return` has the type `Nothing`, so Kotlin allows it on the right side of `?:`.
For `null`, the function exits immediately and never prints `"measuring"`. For
`"cat"`, the Elvis branch is skipped and `value` is known to be non-null.

**How to reason about it:** treat `?: return ...` as a guard clause. Split the
null and non-null paths before reading the remaining lines.
