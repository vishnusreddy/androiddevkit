---
question: "How does destructuring work, and what is the componentN convention?"
topic: kotlin
difficulty: mid
tags: ["kotlin", "destructuring"]
---

Destructuring unpacks an object into multiple variables. It works by calling **`component1()`, `component2()`, …** operator functions in order.

```kotlin
val (id, name) = user        // user.component1(), user.component2()
val (key, value) = mapEntry  // Map.Entry has component1/2
for ((index, item) in list.withIndex()) { /* ... */ }
```

`data class` generates `componentN()` for its primary-constructor properties automatically. Any class can support it by declaring them manually:

```kotlin
class Point(val x: Int, val y: Int) {
    operator fun component1() = x
    operator fun component2() = y
}
```

**Gotchas worth raising:**
- Destructuring is **positional, not by name** - `val (name, id) = user` silently assigns `name = user.id` if you get the order wrong. This is a real bug source; reordering data-class properties can break callers.
- Use `_` to skip a component: `val (_, name) = user`.
- Works in lambda parameters too: `map.forEach { (k, v) -> ... }`.
