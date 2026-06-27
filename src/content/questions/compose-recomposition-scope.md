---
question: "What is a recomposition scope, and what is the 'donut-hole skipping' optimization?"
topic: jetpack-compose
difficulty: senior
tags: ["compose", "recomposition", "performance"]
---

A **recomposition scope** is the smallest restartable unit Compose can re-execute — roughly, a `@Composable` function (and certain inline blocks). When state read inside a scope changes, Compose re-runs **only that scope**, not the whole tree. This is **smart/partial recomposition**.

**Donut-hole skipping:** if a composable reads state, only the part that *reads* it recomposes — a child that doesn't read it can be skipped even though its parent recomposed. The state read is the "hole"; the surrounding dough is skipped.

```kotlin
@Composable
fun Screen() {
    var count by remember { mutableStateOf(0) }
    Column {
        ExpensiveHeader()              // does NOT read count → skipped on count change
        Text("Count: $count")         // reads count → recomposes
        Button(onClick = { count++ }) { Text("+") }
    }
}
```

When `count` changes, only the `Text` recomposes; `ExpensiveHeader` is skipped (its inputs didn't change and it's skippable).

**Practical implications:**
- **Read state as low as possible.** Reading `count` in `Screen`'s body would expand the scope; reading it inside `Text` keeps the hole small.
- **Defer reads to lambdas/later phases** (`Modifier.offset { }`) to avoid composition entirely.
- A composable is only **skippable** if its parameters are **stable** (see stability) — unstable params force it to recompose even when the parent does.
- Returning `Unit` and not reading changed state are what let Compose skip a scope.

**Soundbite:** "Recomposition is scoped to the function reading the changed state; donut-hole skipping means siblings/children that don't read it are skipped — so read state as deep and as late as you can."
