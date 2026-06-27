---
question: "How does mutableStateOf update the Compose UI?"
topic: jetpack-compose
difficulty: mid
tags: ["compose", "state", "snapshot"]
---

`mutableStateOf` holds a value that Compose can observe. When a composable reads
that value, Compose remembers the dependency. Changing the value then schedules
that part of the UI to run again with the new state.

```kotlin
var count by remember { mutableStateOf(0) }  // `by` uses property delegation
Text("$count")          // reading count subscribes this Text to changes
Button(onClick = { count++ }) { Text("+") }  // writing schedules recomposition
```

That is enough for most Junior and Mid interviews: state is read, the value
changes, and the UI that read it recomposes.

**Optional detail: the snapshot system.** Compose stores observable state in
snapshots so a group of reads sees a consistent view of state. This supports:
- **Controlled changes** - `Snapshot.withMutableSnapshot { }` can apply a group
  of changes together. Ordinary UI state should still usually be updated from
  the main thread.
- **Consistency** - within one recomposition pass you never see half-updated state.
- **Precise observation** - `snapshotFlow { }` can turn any state read into a Flow.

**Why `remember` is required:** `mutableStateOf(0)` alone creates a **new** state object on every recomposition, resetting it. `remember { }` keeps the *same* state object across recompositions. `rememberSaveable` additionally survives recreation.

**Storage options:** `mutableStateOf` (single value), `mutableStateListOf` / `mutableStateMapOf` (observable collections that trigger recomposition on add/remove), and `derivedStateOf` (computed). Use the observable collections rather than a plain `MutableList` inside state, or mutations won't trigger recomposition.
