---
question: "Does data class copy() make a deep copy?"
topic: code-snippet-output
difficulty: junior
order: 20
starred: true
section: "Objects and dispatch"
tags: ["kotlin", "output-based", "data-class", "copy"]
---

```kotlin
data class Team(
    val name: String,
    val members: MutableList<String>,
)

val first = Team("Android", mutableListOf("Maya"))
val second = first.copy(name = "Mobile")

second.members += "Noah"

println(first)
println(second)
println(first.members === second.members)
```

**Output:**

```text
Team(name=Android, members=[Maya, Noah])
Team(name=Mobile, members=[Maya, Noah])
true
```

`copy()` is shallow. It creates a new `Team`, but properties that were not
replaced keep the same references. Both objects therefore point to one mutable
list.

In production code, prefer immutable collections in state models. If a true
independent copy is required, copy the nested value as well:

```kotlin
val second = first.copy(
    name = "Mobile",
    members = first.members.toMutableList(),
)
```

**How to reason about it:** draw the two objects and their references. Do not
assume that a new outer object means new nested objects.
