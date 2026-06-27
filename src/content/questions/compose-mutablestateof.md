---
question: "How does mutableStateOf work? What is the snapshot system?"
topic: jetpack-compose
difficulty: senior
tags: ["compose", "state", "snapshot"]
---

`mutableStateOf(x)` returns a `MutableState<T>` — an **observable** holder. When you **read** `.value` inside a composable, Compose records that this composable depends on that state; when you **write** `.value`, Compose schedules a recomposition of exactly the readers. That read-tracking is what makes `UI = f(state)` work without manual wiring.

```kotlin
var count by remember { mutableStateOf(0) }  // `by` uses property delegation
Text("$count")          // reading count subscribes this Text to changes
Button(onClick = { count++ }) { Text("+") }  // writing schedules recomposition
```

**The snapshot system** underneath: Compose state lives in a **snapshot** — like an in-memory MVCC database. Each thread/composition sees a consistent snapshot of all state; mutations are isolated until applied. This gives:
- **Thread safety** — you can read state on one thread and mutate on another safely; `Snapshot.withMutableSnapshot { }` batches atomic changes.
- **Consistency** — within one recomposition pass you never see half-updated state.
- **Precise observation** — `snapshotFlow { }` can turn any state read into a Flow.

**Why `remember` is required:** `mutableStateOf(0)` alone creates a **new** state object on every recomposition, resetting it. `remember { }` keeps the *same* state object across recompositions. `rememberSaveable` additionally survives recreation.

**Storage options:** `mutableStateOf` (single value), `mutableStateListOf` / `mutableStateMapOf` (observable collections that trigger recomposition on add/remove), and `derivedStateOf` (computed). Use the observable collections rather than a plain `MutableList` inside state, or mutations won't trigger recomposition.
