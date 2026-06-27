---
question: "Explain LaunchedEffect. Why do its keys matter?"
topic: jetpack-compose
difficulty: mid
tags: ["compose", "side-effects", "LaunchedEffect"]
---

`LaunchedEffect` runs a **suspend** block tied to the composition. It launches a coroutine when the composable **enters** the composition and **cancels** it when the composable leaves - perfect for one-off or ongoing async work driven by Compose.

```kotlin
LaunchedEffect(Unit) {
    viewModel.loadData()          // runs once when entering composition
}
```

**The keys are the crucial part.** `LaunchedEffect(key1, key2, …)` **restarts** the coroutine (cancels the old, starts a new) whenever **any key changes**. If keys don't change across recompositions, the same coroutine keeps running.

```kotlin
LaunchedEffect(userId) {
    user = repository.loadUser(userId)   // reloads whenever userId changes
}
```

- **`LaunchedEffect(Unit)`** or `LaunchedEffect(true)` - run **once** for the composable's lifetime (key never changes). Good for "fire on first appearance."
- **`LaunchedEffect(key)`** - re-run when `key` changes. The classic bug is using `Unit` when you *need* it to re-run on a parameter change (stale data), or capturing a value that's stale because it isn't a key.

**Output-based trap:**
```kotlin
LaunchedEffect(Unit) {
    delay(2000)
    println(count)     // captures count at first composition - may be STALE
}
```
If `count` should be current, either add it as a key, or wrap it in `rememberUpdatedState`.
