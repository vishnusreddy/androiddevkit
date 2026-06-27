---
question: "What is state hoisting, and what makes a composable stateless?"
topic: jetpack-compose
difficulty: mid
tags: ["compose", "state-hoisting", "state"]
---

**State hoisting** is moving state *up* out of a composable to its caller, so the composable becomes **stateless** — it receives the value and a callback to change it, rather than owning the state.

The pattern is **value down, events up**:

```kotlin
// Stateless: owns no state, fully driven by parameters
@Composable
fun SearchBar(query: String, onQueryChange: (String) -> Unit) {
    TextField(value = query, onValueChange = onQueryChange)
}

// Stateful caller owns the state
@Composable
fun SearchScreen(viewModel: SearchViewModel) {
    val query by viewModel.query.collectAsStateWithLifecycle()
    SearchBar(query = query, onQueryChange = viewModel::onQueryChange)
}
```

**Why hoist:**
- **Reusable** — a stateless composable works anywhere; the caller decides where state lives.
- **Testable** — you can render it with any value, no internal state to set up.
- **Single source of truth** — state lives in one place (ViewModel or a parent), avoiding divergent copies.
- **Controllable** — the parent can intercept, transform, or share the state.

**Stateful vs stateless:**
- *Stateful* composables hold their own `remember { mutableStateOf(...) }` — convenient for self-contained widgets where the caller doesn't care about the state.
- *Stateless* ones take state as parameters — preferred for anything shared, tested, or driven by a ViewModel.

A common design is to offer **both**: a stateful overload (with a default `rememberX` state) that delegates to a stateless one — exactly how Compose's own `Scaffold`/`rememberScaffoldState` are structured.
