---
question: "How does RecyclerView work, and what does DiffUtil do?"
topic: android-fundamentals
difficulty: mid
tags: ["recyclerview", "views", "performance"]
---

**RecyclerView** efficiently displays large lists by **recycling** a small pool of item views instead of creating one per data item. The pieces:

- **`ViewHolder`** — caches the views for one row so you don't `findViewById` repeatedly.
- **`Adapter`** — `onCreateViewHolder` (inflate, called rarely) + `onBindViewHolder` (bind data to a recycled holder, called often). The **recycling** is the whole point: as you scroll, off-screen holders are rebound with new data.
- **`LayoutManager`** — positions items (`Linear`, `Grid`, `StaggeredGrid`).
- **`ItemAnimator`**, **`ItemDecoration`** — animations and dividers/spacing.

**`DiffUtil`** computes the **minimal set of changes** between an old and new list (using a Myers diff) so you can dispatch precise `notifyItemInserted/Removed/Changed` instead of `notifyDataSetChanged()`.

```kotlin
class MyDiff : DiffUtil.ItemCallback<Item>() {
    override fun areItemsTheSame(a: Item, b: Item) = a.id == b.id        // same entity?
    override fun areContentsTheSame(a: Item, b: Item) = a == b           // same content?
}
class MyAdapter : ListAdapter<Item, MyVH>(MyDiff()) { ... }
adapter.submitList(newList)   // diff + granular updates, with animations
```

Why it matters:
- `notifyDataSetChanged()` **rebinds everything** and kills animations/scroll position — wasteful.
- DiffUtil gives **smooth animations** and only rebinds changed rows.
- **`areItemsTheSame`** = same identity (by id); **`areContentsTheSame`** = same data (drives the "changed" animation). Getting these wrong causes flicker or missed updates.
- **`ListAdapter`** wraps DiffUtil and runs it on a **background thread** via `AsyncListDiffer` — the recommended adapter base class.

**Compose parallel:** `LazyColumn` is the Compose equivalent; its `items(key = {})` plays the role of DiffUtil's identity matching.

**Soundbite:** "RecyclerView recycles ViewHolders to render big lists cheaply; DiffUtil (via ListAdapter) computes minimal changes for granular, animated updates instead of `notifyDataSetChanged()`."
