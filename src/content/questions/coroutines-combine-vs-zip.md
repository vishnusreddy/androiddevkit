---
question: "combine vs zip for Flows - what's the difference?"
topic: coroutines
difficulty: mid
order: 140
starred: false
section: "Flow operators"
tags: ["flow", "combine", "zip", "operators"]
---

Both merge multiple flows, but emit on different triggers.

**`zip`** pairs emissions **one-to-one, in lockstep**. It waits until *both* flows have a new value, then emits a pair. It completes when *either* flow completes. Use it to pair up corresponding items.

**`combine`** emits whenever **any** flow emits, using that flow's newest value plus the **latest** value of the others. It needs every flow to have emitted at least once before the first emission.

```kotlin
val a = flowOf(1, 2, 3)
val b = flowOf("x", "y")

a.zip(b) { n, s -> "$n$s" }       // [1x, 2y]  - pairs, stops at shorter
a.combine(b) { n, s -> "$n$s" }   // e.g. [3x, 3y] or [1x,2x,3x,3y]… - latest of each
```

**When to use which:**
- **`combine`** - building UI state from several independent sources: `combine(user, settings, network) { ... }`. Any source changing should recompute the result with the latest of the others. This is the common one in apps.
- **`zip`** - genuinely paired streams where item *N* of one corresponds to item *N* of the other (e.g. requests with their responses).

**Gotchas:**
- `combine`'s output count is non-deterministic - it depends on timing. Don't assume a fixed number of emissions.
- `combine` won't emit until **every** input has emitted once, so give each source an initial value (a `StateFlow` always has one, which is why it pairs well with `combine`).
