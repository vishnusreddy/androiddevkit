---
question: "How do default arguments behave with overridden functions?"
topic: code-snippet-output
difficulty: mid
order: 20
starred: true
section: "Objects and dispatch"
tags: ["kotlin", "output-based", "default-arguments", "inheritance"]
---

```kotlin
open class Base {
    open fun greet(name: String = "base") = "Base: $name"
}

class Child : Base() {
    override fun greet(name: String) = "Child: $name"
}

val value: Base = Child()
println(value.greet())
```

**Output:**

```text
Child: base
```

Two rules work together. The default argument comes from the declaration chosen
at the call site, so `Base.greet` supplies `"base"`. The function body uses
virtual dispatch, so `Child.greet` runs.

An override does not repeat default parameter values. Kotlin keeps those values
on the base declaration.

**How to reason about it:** resolve omitted arguments using the variable's
compile-time type, then resolve the overridden body using the runtime type.
