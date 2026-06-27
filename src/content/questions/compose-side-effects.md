---
question: "Compare the side-effect APIs: LaunchedEffect, DisposableEffect, SideEffect, rememberCoroutineScope."
topic: jetpack-compose
difficulty: mid
tags: ["compose", "side-effects"]
---

A **side effect** is anything that escapes the scope of a composable (network call, listener registration, logging). Composition can run often and unpredictably, so you must contain side effects in the right API:

**`LaunchedEffect(keys)`** - run a **suspend** block scoped to composition; cancelled on leave, restarted on key change. For coroutine work *driven by* the composition.

**`DisposableEffect(keys)`** - for effects that need **cleanup**. Register in the block, clean up in `onDispose`. Re-runs (dispose + re-setup) on key change.
```kotlin
DisposableEffect(lifecycleOwner) {
    val observer = LifecycleEventObserver { _, e -> /* ... */ }
    lifecycleOwner.lifecycle.addObserver(observer)
    onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
}
```

**`SideEffect { }`** - runs **after every successful recomposition**. Use to publish Compose state to a non-Compose object (e.g. update an analytics property or a third-party controller).

**`rememberCoroutineScope()`** - returns a `CoroutineScope` tied to the composition that you launch from **event callbacks** (not during composition):
```kotlin
val scope = rememberCoroutineScope()
Button(onClick = { scope.launch { snackbarHost.showSnackbar("Hi") } }) { ... }
```

**How to choose:**
- Suspend work when entering / on key change → **`LaunchedEffect`**.
- Need teardown (listeners, callbacks) → **`DisposableEffect`**.
- Launch a coroutine in response to a **user event** → **`rememberCoroutineScope`**.
- Sync Compose state to a non-Compose API every recomposition → **`SideEffect`**.

**The rule:** never call `viewModel.load()` or launch coroutines *directly* in a composable body - it'd fire on every recomposition. Use these APIs to scope effects correctly.
