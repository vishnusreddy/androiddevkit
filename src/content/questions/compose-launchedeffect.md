---
question: "How does LaunchedEffect work, and why do its keys matter?"
topic: jetpack-compose
difficulty: mid
order: 50
starred: true
section: "Effects and lifecycle"
tags: ["compose", "side-effects", "LaunchedEffect", "keys"]
---

`LaunchedEffect` launches a coroutine when its call enters the composition. The
coroutine is cancelled when that call leaves. If any key changes, Compose cancels
the old coroutine and starts a new one.

```kotlin
@Composable
fun UserRoute(userId: String, viewModel: UserViewModel) {
    LaunchedEffect(userId) {
        viewModel.load(userId)
    }
}
```

The key states the effect's restart policy. Here a new user ID means the old load
is no longer the right work.

Common mistakes are:

- Using `LaunchedEffect(Unit)` while reading a changing input. The effect keeps
  running with assumptions from its first launch.
- Adding a value as a key even though a change should not restart the work. A
  timer can then keep resetting.
- Using an unstable key that changes on every recomposition, which repeatedly
  cancels useful work.

When a long-lived effect should keep running but use the latest callback, pair a
constant key with `rememberUpdatedState`:

```kotlin
val currentOnTimeout by rememberUpdatedState(onTimeout)

LaunchedEffect(Unit) {
    delay(5_000)
    currentOnTimeout()
}
```

`LaunchedEffect(Unit)` is valid when its lifetime should match that call site,
but it deserves the same pause you would give `while (true)`. Make sure "start
once for this instance" is really the intended rule.

One final distinction: user events are not composition events. For a click that
shows a snackbar, launch from `rememberCoroutineScope()` inside `onClick`.
