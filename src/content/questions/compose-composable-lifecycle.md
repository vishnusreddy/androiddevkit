---
question: "What is the lifecycle of a composable?"
topic: jetpack-compose
difficulty: mid
order: 20
starred: true
section: "State and recomposition"
tags: ["compose", "lifecycle", "composition"]
---

A composable instance has three lifecycle events:

1. It enters the composition.
2. It recomposes zero or more times.
3. It leaves the composition.

Recomposition is not a lifecycle callback like `onStart`. It is the runtime
reevaluating UI that may be out of date. Compose may skip a call when its inputs
have not changed, so business logic must not depend on how often the function
runs.

This lifecycle explains the common APIs:

- `remember` keeps a value while that call remains in the composition.
- `LaunchedEffect` starts a coroutine on entry, restarts when a key changes, and
  cancels when it leaves.
- `DisposableEffect` provides `onDispose` for unregistering a listener or
  releasing another resource.
- `rememberCoroutineScope` returns a scope cancelled when its call leaves.

```kotlin
@Composable
fun LocationObserver(client: LocationClient) {
    DisposableEffect(client) {
        val listener = client.addListener { /* update state */ }
        onDispose { client.removeListener(listener) }
    }
}
```

Identity is part of the story. Calls at different positions are different
instances. In a changing list, stable keys help Compose keep an instance and its
remembered state attached to the correct item.

For an interview, connect the lifecycle to a real bug: work launched directly
in the composable body may run again on recomposition, while a listener without
`onDispose` can outlive the UI that registered it.
