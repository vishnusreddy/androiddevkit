---
question: "LazyColumn vs Column, and why provide keys to items?"
topic: jetpack-compose
difficulty: junior
tags: ["compose", "lazycolumn", "performance", "keys"]
---

**`Column`** composes and lays out **all** its children immediately, whether or not they're on screen - fine for a handful of items, disastrous for a long/unbounded list. **`LazyColumn`** only composes the items **currently visible** (plus a small buffer) and recycles them as you scroll - the Compose equivalent of `RecyclerView`.

```kotlin
LazyColumn {
    items(users, key = { it.id }) { user ->
        UserRow(user)
    }
}
```

**Why `key = { it.id }` matters:**
- By **default**, Lazy lists identify items by their **position/index**. If the list reorders, inserts, or removes items, Compose can mismatch state to the wrong item.
- A **stable key** ties each item's identity (and its `remember`ed state, animations, scroll position) to the *data*, not the index. So when items move, Compose **moves** the existing composition instead of recomposing everything.
- Without keys, deleting the first item makes every item below shift index, causing unnecessary recomposition and **losing per-item state** (e.g. an expanded row collapses, a half-typed field clears).

**Other LazyColumn tools:**
- **`contentType`** - hint the type of each item so Compose reuses compositions of the same type more efficiently in heterogeneous lists.
- **`rememberLazyListState()`** - observe/control scroll (with `derivedStateOf` for things like "show scroll-to-top").
- Don't nest a vertically-scrolling `LazyColumn` inside a vertically-scrolling parent without a bounded height - it can crash or measure infinitely.
