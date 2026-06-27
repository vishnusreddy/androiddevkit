---
question: "What is the lifecycle of a composable?"
topic: jetpack-compose
difficulty: mid
tags: ["compose", "lifecycle", "composition"]
---

A composable's lifecycle is much simpler than an Activity's - it has three events:

1. **Enters the composition** - the composable is called for the first time and added to the composition tree.
2. **Recomposes** - re-executed zero or more times as the state it reads changes. This can happen frequently and in any order.
3. **Leaves the composition** - removed from the tree (e.g. an `if` becomes false, a list item scrolls off, the screen is gone).

```
Enter composition → Recompose* (0..n) → Leave composition
```

**What this means in practice:**
- **`remember`** survives across recompositions but is **lost** when the composable leaves the composition (and re-created if it re-enters). `rememberSaveable` additionally survives Activity recreation.
- **Effects are scoped to this lifecycle:** `LaunchedEffect`'s coroutine is cancelled when the composable **leaves**; `DisposableEffect.onDispose` runs on leave (or key change).
- **Recomposition is not sequential or guaranteed** - composables can recompose in parallel, be skipped, or run out of order, so they must be **side-effect free** in their body. Never rely on execution order or mutate external state directly in composition.
- A composable can leave and re-enter (scrolling a `LazyColumn` item off and back) - its `remember`ed state resets unless hoisted or `rememberSaveable`/keyed.

**Contrast with Views:** there's no `onCreate`/`onDestroy` per widget; "creation" is entering composition and "destruction" is leaving it. Identity is by call-site position (or `key`).
