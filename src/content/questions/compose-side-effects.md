---
question: "How do you choose between LaunchedEffect, DisposableEffect, SideEffect, and rememberCoroutineScope?"
topic: jetpack-compose
difficulty: mid
order: 40
starred: true
section: "Effects and lifecycle"
tags: ["compose", "side-effects", "lifecycle"]
---

A composable body should describe UI. When work must escape that body, choose an
effect based on what starts it and how it should stop.

- `LaunchedEffect(keys)` runs suspend work tied to a call in the composition. It
  cancels when the call leaves and restarts when a key changes.
- `DisposableEffect(keys)` is for registration with matching cleanup, such as a
  lifecycle observer or callback listener.
- `SideEffect` runs after every successful recomposition. It is useful for
  publishing Compose state to an object not managed by Compose.
- `rememberCoroutineScope()` provides a composition-aware scope for event
  handlers, such as showing a snackbar after a tap.

```kotlin
val scope = rememberCoroutineScope()

Button(
    onClick = {
        scope.launch {
            snackbarHostState.showSnackbar("Saved")
        }
    },
) {
    Text("Save")
}
```

For a listener, cleanup is the deciding factor:

```kotlin
DisposableEffect(lifecycleOwner) {
    val observer = LifecycleEventObserver { _, event ->
        analytics.onLifecycleEvent(event)
    }
    lifecycleOwner.lifecycle.addObserver(observer)

    onDispose {
        lifecycleOwner.lifecycle.removeObserver(observer)
    }
}
```

Avoid calling `viewModel.load()` or launching a coroutine directly in the
composable body. Recomposition can repeat that work.

**Quick decision:** composition event plus suspend work, use `LaunchedEffect`;
user event plus suspend work, use `rememberCoroutineScope`; setup and teardown,
use `DisposableEffect`; publish after a successful composition, use
`SideEffect`.
