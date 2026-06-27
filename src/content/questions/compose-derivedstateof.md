---
question: "What is derivedStateOf, and when should you use it instead of a plain calculation?"
topic: jetpack-compose
difficulty: senior
tags: ["compose", "derivedStateOf", "performance", "state"]
---

`derivedStateOf` creates a state object whose value is **computed from other state**, but only **notifies readers when the computed result actually changes** — not every time an input changes.

Use it when a **frequently-changing** state feeds a **rarely-changing** derived value:

```kotlin
val listState = rememberLazyListState()

// Recomputes as you scroll, but only emits true/false transitions
val showButton by remember {
    derivedStateOf { listState.firstVisibleItemIndex > 0 }
}

if (showButton) ScrollToTopButton()
```

Here `firstVisibleItemIndex` changes on **every scroll frame**, but `showButton` only flips `false→true→false`. Without `derivedStateOf`, any composable reading `showButton` would recompose on every scroll tick. With it, recomposition happens **only when the boolean changes** — a big saving.

**When NOT to use it:** when the output changes about as often as the input. `derivedStateOf` has overhead, so for `val full = "$first $last"` (changes whenever inputs do) a plain calculation is better — wrapping it adds cost for no benefit.

**The decision rule:** reach for `derivedStateOf` when **one or more rapidly-changing states** collapse into a value that changes **far less often**. If input-change-rate ≈ output-change-rate, just compute it directly.

**Common pairing:** `remember { derivedStateOf { } }` — the `remember` keeps the derived-state object across recompositions; the `derivedStateOf` controls when readers are notified.
