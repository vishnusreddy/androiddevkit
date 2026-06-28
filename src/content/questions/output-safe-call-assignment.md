---
question: "Is the right side evaluated when a safe-call assignment is skipped?"
topic: code-snippet-output
difficulty: mid
order: 10
starred: true
section: "Reading Kotlin"
tags: ["kotlin", "output-based", "null-safety", "evaluation"]
---

```kotlin
data class Profile(var name: String)
data class User(val profile: Profile?)

fun loadName(): String {
    println("loading")
    return "Asha"
}

val user: User? = null
user?.profile?.name = loadName()
println("done")
```

**Output:**

```text
done
```

`loadName()` is never called. If any receiver in a safe-call assignment is
`null`, Kotlin skips the assignment and does not evaluate its right-hand side.

This matters when the right side performs work. A safe-call chain can prevent
that work entirely, not merely prevent the final property write.

**How to reason about it:** evaluate the receiver chain first. Only evaluate the
right side if the chain reaches a non-null assignment target.
