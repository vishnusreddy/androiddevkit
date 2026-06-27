---
question: "What does the transform operator do, and how do flatMapConcat, flatMapMerge, and flatMapLatest differ?"
topic: coroutines
difficulty: senior
order: 40
starred: false
section: "Flow sharing and reliability"
tags: ["flow", "operators", "flatMap", "transform"]
---

**`transform { }`** is the general operator behind `map`/`filter`: for each upstream value you can `emit` **zero, one, or many** downstream values.

```kotlin
flow.transform { value ->
    emit("loading $value")
    emit(fetch(value))            // emit multiple per input
}
```

The **`flatMap*`** family handles the case where each value maps to **another flow**, and they differ in how they handle concurrency of those inner flows:

- **`flatMapConcat`** - process inner flows **sequentially**: fully collect one before starting the next. Order preserved, no overlap.
- **`flatMapMerge`** - collect inner flows **concurrently** (up to a concurrency limit), interleaving their emissions. Fastest, order not guaranteed.
- **`flatMapLatest`** - when a new upstream value arrives, **cancel** the current inner flow and switch to the new one.

```kotlin
queries.flatMapLatest { q -> repo.search(q) }   // search-as-you-type (cancel stale)
ids.flatMapMerge { id -> repo.detail(id) }       // load many in parallel
events.flatMapConcat { e -> process(e) }         // strict ordering, one at a time
```

**How to choose:**
- Need **ordering**, one-at-a-time → `flatMapConcat`.
- Need **throughput**, order doesn't matter → `flatMapMerge`.
- Only the **latest** input matters, cancel the rest → `flatMapLatest`.
