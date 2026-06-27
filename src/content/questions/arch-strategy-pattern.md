---
question: "Explain the Strategy pattern with an Android example."
topic: architecture
difficulty: mid
tags: ["design-patterns", "strategy"]
---

The **Strategy pattern** defines a family of interchangeable algorithms behind a common interface, so you can **swap behavior at runtime** without changing the code that uses it.

```kotlin
fun interface SortStrategy {
    fun sort(items: List<Post>): List<Post>
}

val byDate    = SortStrategy { it.sortedByDescending(Post::date) }
val byPopular = SortStrategy { it.sortedByDescending(Post::likes) }

class FeedViewModel(private var strategy: SortStrategy = byDate) {
    fun setStrategy(s: SortStrategy) { strategy = s }
    fun display(posts: List<Post>) = strategy.sort(posts)   // behavior swappable
}
```

**Why use it:**
- **Open/Closed** — add a new strategy (a new sort/validation/formatting rule) without touching existing code or growing a giant `when`.
- **Runtime flexibility** — switch algorithms based on user choice, config, or A/B flags.
- **Testable** — each strategy is isolated and unit-testable.

**Where it shows up in Android:**
- **`RecyclerView.LayoutManager`** — `LinearLayoutManager` / `GridLayoutManager` are interchangeable layout strategies.
- **`Interpolator`** (animations), **`ItemAnimator`**, **`DiffUtil.ItemCallback`**.
- **Image-loading**, caching, or retry **policies** injected into a repository.
- **Validation strategies**, sort/filter options, **payment processors**, ad providers behind an interface.
- In Kotlin it's often just a **function type / `fun interface`** passed in — a lightweight strategy without ceremony.

**Relation to DI:** injecting different implementations of an interface *is* the Strategy pattern applied via dependency injection (debug vs prod logger, fake vs real repo).

**Soundbite:** "Strategy = interchangeable algorithms behind a common interface, swappable at runtime — `LayoutManager`, `Interpolator`, and injected policies are examples. In Kotlin it's often just a `fun interface`/lambda passed in, and DI of interface implementations is Strategy in practice."
