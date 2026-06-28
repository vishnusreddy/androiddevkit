---
question: "When should you use LazyColumn, and why do item keys matter?"
topic: jetpack-compose
difficulty: junior
order: 40
starred: true
section: "Lists"
tags: ["compose", "lazycolumn", "performance", "keys"]
---

Use a `Column` when the content is small and you want every child composed at
once. Use a `LazyColumn` for a large or unknown number of items. A lazy layout
only composes and lays out what its viewport needs.

```kotlin
LazyColumn {
    items(
        items = messages,
        key = { message -> message.id },
        contentType = { message -> message.kind },
    ) { message ->
        MessageRow(message)
    }
}
```

Without an explicit key, item identity is based on position. Insert an item at
the top and all later positions move. Remembered state can then be associated
with the wrong position, and Compose has less information for reusing work and
animating moves.

A good key is unique, stable, and saveable in a `Bundle` if the item uses
`rememberSaveable`. A database ID is ideal. A list index is usually not, because
it changes when items are inserted, removed, or reordered.

`contentType` is a separate optimization for mixed lists. It tells the lazy
layout which items have compatible structures, such as headers and message rows.

One wording detail matters in senior interviews: `LazyColumn` follows principles
similar to `RecyclerView`, but it does not recycle ViewHolder objects. It can
reuse compositions for compatible content.

**Common follow-up:** keys do not make a slow row fast. Profile expensive item
content, image loading, and frequent state reads separately.
