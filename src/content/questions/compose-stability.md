---
question: "What is 'stability' in Compose, and why can an unstable parameter hurt performance?"
topic: jetpack-compose
difficulty: senior
tags: ["compose", "stability", "performance", "recomposition"]
---

Compose **skips** recomposing a composable if all its parameters are **stable** and unchanged since last time. A type is **stable** if Compose can trust that:
1. `equals()` is consistent, and
2. if a public property changes, Compose is notified.

If a parameter is **unstable**, Compose can't prove it's unchanged, so it **can't skip** — the composable recomposes even when nothing meaningfully changed.

**What's stable:** primitives, `String`, function types, `@Immutable`/`@Stable`-annotated types, and `data class`es whose properties are all stable.

**What's unstable (common culprits):**
- **`List`, `Map`, `Set`** — the interface could be backed by a mutable implementation, so Compose treats them as unstable.
- Classes from **other modules** the compiler can't analyze (unless annotated).
- Classes with **`var`** properties (mutable, no change notification).

```kotlin
// items: List<Item> is unstable → this recomposes even when items are equal
@Composable fun Feed(items: List<Item>) { ... }

// Fix 1: use a stable collection
@Composable fun Feed(items: ImmutableList<Item>) { ... }

// Fix 2: annotate the type
@Immutable data class FeedData(val items: List<Item>)
```

**Fixes:**
- Use **`kotlinx.collections.immutable`** (`ImmutableList`/`persistentListOf`) for list params.
- Annotate model classes with **`@Immutable`** / **`@Stable`** when you guarantee the contract.
- Kotlin **2.x strong skipping mode** relaxes this — it can skip composables with unstable params if instances are *referentially* equal, and remembers unstable lambdas — reducing how often you need manual fixes. Still, modeling stable state is good practice.

**How to diagnose:** the **Compose compiler metrics** report tells you which composables are skippable and which parameters are unstable.
