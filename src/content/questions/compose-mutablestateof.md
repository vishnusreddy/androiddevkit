---
question: "How does mutableStateOf trigger recomposition?"
topic: jetpack-compose
difficulty: mid
order: 10
starred: true
section: "State and recomposition"
tags: ["compose", "state", "snapshot", "recomposition"]
---

`mutableStateOf` creates observable state that participates in Compose's
snapshot system.

```kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }

    Text("Count: $count")
    Button(onClick = { count++ }) {
        Text("Add")
    }
}
```

When `Text` reads `count` during composition, Compose records that dependency.
Writing a different value schedules the scopes that observed it for
recomposition. Compose does not simply rerun every composable on the screen.

`remember` matters because the state holder must survive recomposition. Without
it, each run would create a new holder initialized to `0`.

The default mutation policy uses structural equality. Assigning a value equal to
the old one normally does not invalidate readers. Mutating a plain object inside
the state holder is also invisible:

```kotlin
val names = mutableStateOf(mutableListOf("Asha"))
names.value.add("Ben") // the state value was not assigned
```

Use an immutable list and assign a new value, or use `mutableStateListOf` when a
snapshot-aware mutable collection fits the design.

**Senior follow-up:** snapshots give reads a consistent view and support precise
observation. They do not mean all state can be mutated carelessly from any
thread. Concurrent snapshot writes can conflict and application state still
needs a clear owner.
