---
question: "List vs Sequence — what's the performance difference?"
topic: kotlin
difficulty: mid
tags: ["kotlin", "collections", "sequence", "performance"]
---

The difference is **eager vs lazy** evaluation.

- On a **`List`**, each operation (`map`, `filter`, …) is processed fully and **creates a new intermediate list** before the next operation runs. It's horizontal: do all the maps, then all the filters.
- On a **`Sequence`**, elements flow through the whole chain **one at a time**, lazily, with **no intermediate collections**. It's vertical: each element goes through map → filter → … until a terminal operation pulls it.

```kotlin
// List: builds a full mapped list of a million items, then filters it
val r1 = (1..1_000_000).map { it * 2 }.filter { it % 3 == 0 }.first()

// Sequence: pulls elements until first match — barely any work
val r2 = (1..1_000_000).asSequence().map { it * 2 }.filter { it % 3 == 0 }.first()
```

**When sequences win:** large collections, multiple chained operations, or short-circuiting terminals (`first`, `take`, `find`) — you avoid allocating big intermediate lists and can stop early.

**When lists win:** small collections or a single operation. Sequences add per-element overhead (an iterator hop per stage), so for small data the simpler `List` is actually faster.

**Interview soundbite:** "Sequences trade per-element overhead for no intermediate allocations and lazy short-circuiting — a win on big pipelines, a loss on tiny ones."
