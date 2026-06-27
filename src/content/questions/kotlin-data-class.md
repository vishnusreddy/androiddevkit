---
question: "What does a data class generate for you, and what are its limitations?"
topic: kotlin
difficulty: junior
order: 60
starred: true
section: "Classes and modeling"
tags: ["kotlin", "data-class"]
---

For the properties declared in the **primary constructor**, the compiler generates:

- `equals()` / `hashCode()` - structural equality based on those properties
- `toString()` - readable, e.g. `User(id=1, name=Ada)`
- `componentN()` - enables destructuring (`val (id, name) = user`)
- `copy()` - create a modified clone

```kotlin
data class User(val id: Int, val name: String)

val a = User(1, "Ada")
val b = a.copy(name = "Grace")   // User(id=1, name=Grace)
val (id, name) = b               // destructuring
```

**Limitations / gotchas:**

- Only **primary-constructor** properties count toward `equals`/`hashCode`/`toString`. A property declared in the body is ignored by them.
- A data class **can't be `abstract`, `open`, `sealed`, or `inner`**.
- The primary constructor needs at least one parameter, and they must all be `val`/`var`.
- `copy()` does a **shallow** copy - nested mutable objects are shared.

```kotlin
data class Team(val members: MutableList<String>)
val first = Team(mutableListOf("Ada"))
val second = first.copy()
second.members += "Grace"
println(first.members) // [Ada, Grace]; both copies share the list
```

**Common follow-up:** "Two data classes with the same fields - are they equal?" No. `equals` also checks the runtime type, so different classes are never equal even with identical fields.
