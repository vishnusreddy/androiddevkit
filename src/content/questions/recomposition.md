---
question: "What triggers recomposition in Jetpack Compose, and how do you avoid doing it too often?"
topic: jetpack-compose
difficulty: mid
tags: ["compose", "performance", "state"]
---

Recomposition is Compose re-running a composable to update the UI. It's triggered when a **`State` object that the composable reads** changes value. Compose tracks reads at runtime, so only composables that actually read the changed state recompose — not the whole tree.

Keeping it cheap comes down to a few habits:

- **Read state as late as possible.** Pass lambdas or state down rather than values, so only the leaf that needs the value recomposes. Defer reads into `Modifier.drawBehind`/`graphicsLayer` lambdas for things like scroll offsets.
- **Hoist state** so a frequently-changing value lives close to where it's used, not at the top of the screen.
- **Use stable types.** Compose skips a composable if its inputs are *stable* and unchanged. `List` is unstable; prefer `ImmutableList` (kotlinx.collections.immutable) or mark classes `@Immutable`/`@Stable`.
- **Provide keys** in `LazyColumn` items so Compose can match items across changes instead of recomposing everything.
- **Don't allocate in composition.** Wrap expensive computations in `remember(key)` so they don't rerun every recomposition.

```kotlin
// Bad: passes a value, recomposes on every count change
Header(count = count)

// Better: pass a lambda, the read happens inside Header only when needed
Header(count = { count })
```

**How to prove it in an interview:** mention the Layout Inspector's recomposition counts and the Compose compiler metrics/strong-skipping mode — they show you measure rather than guess.
