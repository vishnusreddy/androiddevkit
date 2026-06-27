---
question: "List vs Sequence - what's the performance difference?"
topic: kotlin
difficulty: junior
order: 130
starred: true
section: "Collections"
tags: ["kotlin", "collections", "sequence", "performance"]
---

The headline difference is **eager vs lazy** evaluation, but `Sequence` is not automatically faster.

- On a **`List`**, each operation (`map`, `filter`, …) is processed fully and **creates a new intermediate list** before the next operation runs. It's horizontal: do all the maps, then all the filters.
- On a **`Sequence`**, elements flow through the whole chain **one at a time**, lazily, with **no intermediate collections**. It's vertical: each element goes through map → filter → … until a terminal operation pulls it.

```kotlin
// List: builds a full mapped list of a million items, then filters it
val r1 = (1..1_000_000).map { it * 2 }.filter { it % 3 == 0 }.first()

// Sequence: pulls elements until first match - barely any work
val r2 = (1..1_000_000).asSequence().map { it * 2 }.filter { it % 3 == 0 }.first()
```

Use ordinary collection operations for small inputs or a single transformation: they are simple and often faster because sequences add iterator/lambda overhead. Reach for `Sequence` when you have a large input, several intermediate operations, or a short-circuiting terminal operation such as `first`, `take`, or `any`. Measure hot paths instead of treating laziness as a universal optimization.

**When sequences win:** large collections, multiple chained operations, or short-circuiting terminals (`first`, `take`, `find`) - you avoid allocating big intermediate lists and can stop early.

**When lists win:** small collections or a single operation. Sequences add per-element overhead (an iterator hop per stage), so for small data the simpler `List` is actually faster.
