---
question: "What problem does rememberUpdatedState solve?"
topic: jetpack-compose
difficulty: senior
order: 20
starred: true
section: "Effects and lifecycle"
tags: ["compose", "rememberUpdatedState", "side-effects"]
---

It solves the **stale-capture** problem when a long-lived effect needs to always see the **latest** value of a parameter, but you **don't** want the effect to restart when that value changes.

The classic case - a one-shot effect with a callback that might change:

```kotlin
@Composable
fun AutoDismiss(onTimeout: () -> Unit) {
    // Keep the latest onTimeout without restarting the timer
    val currentOnTimeout by rememberUpdatedState(onTimeout)

    LaunchedEffect(Unit) {        // runs ONCE - keyed on Unit on purpose
        delay(5000)
        currentOnTimeout()        // calls the LATEST callback, not the first
    }
}
```

**The dilemma without it:**
- If you put `onTimeout` as a `LaunchedEffect` **key**, the 5-second timer **restarts** every time the parent passes a new lambda - the dismiss never fires.
- If you key on `Unit` and call `onTimeout` directly, the effect captures the **first** lambda - stale; later updates are ignored.

`rememberUpdatedState` gives you a stable holder whose `.value` is **updated on every recomposition** to the newest value, while the effect itself stays keyed on `Unit` (never restarts). Best of both: timer runs once, callback is always current.

**When to use it:** long-running effects (timers, animations, listeners started once) that reference frequently-changing parameters/callbacks you want fresh but not as restart triggers.
