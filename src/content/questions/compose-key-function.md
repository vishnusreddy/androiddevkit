---
question: "What does the key() composable do, and why is identity important in Compose?"
topic: jetpack-compose
difficulty: mid
order: 130
starred: false
section: "State and recomposition"
tags: ["compose", "key", "state", "identity"]
---

Compose identifies each composable by its **position in the source/call tree** (positional memoization). That's how it knows which `remember`ed state belongs to which call. The **`key()`** composable lets you override that identity with a value you control.

```kotlin
@Composable
fun Names(names: List<Name>) {
    Column {
        for (name in names) {
            key(name.id) {                 // tie identity to id, not position
                NameRow(name)              // its remembered state follows the data
            }
        }
    }
}
```

**Why it matters:** without `key`, if the list reorders or you insert/remove an item, the *position* of each `NameRow` changes, so Compose mismatches remembered state, animations, and focus to the wrong items. Wrapping in `key(name.id)` ties identity to the **data**, so Compose **moves** existing state with the item instead of recreating it.

**Where you see it:**
- Manual loops (`for` inside `Column`) - wrap each iteration in `key()`.
- **`LazyColumn`/`LazyRow`** - the `items(list, key = { it.id })` parameter does the same thing for lazy lists.

**Symptoms of missing keys:**
- A row's expanded/collapsed state or half-typed text jumps to the wrong item after a reorder/delete.
- Item animations glitch.
- Unnecessary recomposition because state can't be matched.
