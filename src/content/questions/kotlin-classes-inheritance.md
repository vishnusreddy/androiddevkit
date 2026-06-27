---
question: "Why are Kotlin classes final by default? How do open, abstract, and interfaces differ?"
topic: kotlin
difficulty: junior
order: 65
starred: true
section: "Classes and modeling"
tags: ["kotlin", "classes", "inheritance", "open"]
---

Kotlin classes and members are **final by default**: they cannot be inherited or overridden unless you explicitly allow it. This nudges code toward composition and makes extension points deliberate.

```kotlin
open class Vehicle {
    open fun move() = "moving"
    fun stop() = "stopped" // final; cannot be overridden
}

class Bike : Vehicle() {
    override fun move() = "pedalling"
}
```

- **`open class`**: may be instantiated and subclassed. Only `open` members may be overridden.
- **`abstract class`**: cannot be instantiated; may hold constructor state, implemented methods, and abstract members. Abstract members are implicitly open.
- **`interface`**: defines a capability or contract. It can contain default method bodies and properties without backing fields, and a class may implement several interfaces.

Use an abstract class when related implementations need shared state or construction. Use interfaces for roles that unrelated types can implement. Prefer composition when you only want to reuse behavior because inheritance creates tighter coupling.

**Common follow-up:** an `override` member is open by default. Mark it `final override` when subclasses must not replace it again.
