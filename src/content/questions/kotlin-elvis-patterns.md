---
question: "Show some practical uses of the Elvis operator beyond a simple default."
topic: kotlin
difficulty: junior
order: 30
starred: false
section: "Language essentials"
tags: ["kotlin", "null-safety", "elvis"]
---

The Elvis operator `?:` returns its left side if non-null, otherwise the right side. Its power comes from the right side being able to be **any expression - including `return` and `throw`** (both have type `Nothing`).

```kotlin
// 1. Default value
val name = user?.name ?: "Guest"

// 2. Early return - "guard clause"
fun process(input: String?) {
    val text = input ?: return            // bail out if null
    println(text.length)                  // text is non-null here
}

// 3. Fail fast with a meaningful message
val config = loadConfig() ?: throw IllegalStateException("config missing")

// 4. Chained fallbacks
val displayName = nickname ?: fullName ?: email ?: "Anonymous"

// 5. Default for a whole expression
val count = map[key]?.size ?: 0
```

**Why interviewers like #2 and #3:** after `val x = nullable ?: return`, the compiler **smart-casts `x` to non-null** for the rest of the function - cleaner than nesting everything inside `?.let { }` or an `if (x != null)` block.
