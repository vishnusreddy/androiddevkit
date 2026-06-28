---
question: "What happens when associateBy produces the same key more than once?"
topic: code-snippet-output
difficulty: junior
order: 30
starred: false
section: "Collections and evaluation"
tags: ["kotlin", "output-based", "collections", "maps"]
---

```kotlin
data class User(val id: Int, val name: String)

val users = listOf(
    User(1, "Asha"),
    User(2, "Ben"),
    User(1, "Cara"),
)

println(users.associateBy { it.id })
```

**Output:**

```text
{1=User(id=1, name=Cara), 2=User(id=2, name=Ben)}
```

When more than one element produces the same key, the last value wins. The key
keeps its original insertion position in the returned map, which is why key `1`
still appears before key `2`.

If duplicates should be retained, use `groupBy` instead. It returns a list of
values for each key.

**How to reason about it:** build the map one input at a time. An existing key is
updated rather than inserted again.
