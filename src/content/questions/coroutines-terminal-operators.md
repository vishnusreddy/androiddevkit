---
question: "What are terminal operators on a Flow, and why does nothing happen without one?"
topic: coroutines
difficulty: junior
order: 80
starred: false
section: "Flow foundations"
tags: ["flow", "terminal-operators", "cold"]
---

A Flow is **cold** - the chain of intermediate operators (`map`, `filter`, `onEach`…) just **describes** work. Nothing runs until a **terminal operator** starts collection. Terminal operators are `suspend` functions (they need a coroutine).

```kotlin
val pipeline = flow { emit(1); emit(2) }.map { it * 10 }
// Nothing has run yet - pipeline is just a recipe.

pipeline.collect { println(it) }   // NOW it runs: 10, 20
```

Common terminal operators:
- **`collect { }`** - the fundamental one; process every value.
- **`toList()` / `toSet()`** - gather into a collection.
- **`first()` / `firstOrNull()`** - take the first value (and cancel upstream).
- **`single()`** - expect exactly one value.
- **`reduce` / `fold`** - accumulate to a single result.
- **`count()`** - count emissions.
- **`launchIn(scope)`** - collect in a given scope without a lambda (usually after `onEach`).

```kotlin
flow.onEach { render(it) }.launchIn(viewModelScope)   // fire-and-collect
```

**Why this matters:** the classic bug is building a flow with `onEach`/`map` and wondering why the side effects never fire - there's no terminal operator, so collection never starts. "Cold flows do nothing until collected" is the point being tested.
