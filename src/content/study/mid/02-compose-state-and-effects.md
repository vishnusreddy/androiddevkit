---
title: Compose state, recomposition, and side effects
description: Write Compose UI that reacts predictably when values change, items move, or effects restart.
level: mid
order: 2
duration: 55 min
quizHref: /practice/?test=jetpack-compose-test
quizLabel: Take the Compose quiz
---

Jetpack Compose describes UI from **state**. When observable state that a composable **read** changes, Compose schedules **recomposition** of the parts of the tree that depend on it. Recomposition is normal and may run often. A composable body must remain a **description of UI**, not a place for network calls, analytics floods, or navigation storms.

Mid-level Compose skill is less about knowing every widget and more about **state lifetime**, **stability**, **effect keys**, and **list identity**.

## Learning goals

- Choose `remember`, `rememberSaveable`, ViewModel state, and disk for the right lifetime.
- Explain recomposition and why side effects need effect APIs.
- Key `LaunchedEffect` / `DisposableEffect` correctly.
- Provide stable keys in Lazy lists.
- Hoist state so UIs stay testable and reusable.

## Mental model: composition phases

Compose roughly:

1. **Composition** - build/update the tree of composables.
2. **Layout** - measure and place.
3. **Drawing** - draw pixels.

State reads during composition subscribe that scope to changes. When state changes, affected scopes recompose.

```kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }
    Button(onClick = { count++ }) {
        Text("Clicked $count")
    }
}
```

Each click writes state → recomposition → button label updates.

## Choose state lifetime on purpose

| API | Survives recomposition | Survives config change | Survives process death |
|-----|------------------------|------------------------|------------------------|
| `remember` | Yes | No | No |
| `rememberSaveable` | Yes | Yes (small) | Yes (small) |
| ViewModel state | Yes | Yes | No (unless SavedStateHandle) |
| Database / DataStore | Yes | Yes | Yes |

```kotlin
// Ephemeral animation / dropdown
var expanded by remember { mutableStateOf(false) }

// Query field the user expects after rotation
var query by rememberSaveable { mutableStateOf("") }

// Business screen state
val uiState by viewModel.uiState.collectAsStateWithLifecycle()
```

### Keying `remember`

If the remembered value depends on an input identity, pass keys:

```kotlin
val formatter = remember(locale) { DateTimeFormatter.ofLocalizedDate(FormatStyle.MEDIUM) }
```

Without `locale` as a key, rotation of language might keep a stale formatter.

## State hoisting

Move state up so the child is reusable and testable:

```kotlin
@Composable
fun SearchField(
    query: String,
    onQueryChange: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    TextField(
        value = query,
        onValueChange = onQueryChange,
        modifier = modifier,
    )
}

@Composable
fun SearchScreen(viewModel: SearchViewModel = viewModel()) {
    val query by viewModel.query.collectAsStateWithLifecycle()
    SearchField(
        query = query,
        onQueryChange = viewModel::onQueryChange,
    )
}
```

**Stateless composables** take state in and send events out. **Stateful** wrappers own `remember` for previews and simple local chrome.

## Side effects need clear APIs

Never do this inside a composable body unconditionally:

```kotlin
@Composable
fun Broken(userId: String) {
    // Runs on every recomposition - disaster
    analytics.track("profile_open")
    api.preload(userId)
}
```

### `LaunchedEffect`

Starts a coroutine tied to the composition; cancels and restarts when keys change:

```kotlin
LaunchedEffect(userId) {
    analytics.track("profile_open", mapOf("id" to userId))
    viewModel.load(userId)
}
```

Keys matter:

- `LaunchedEffect(Unit)` - once per enter composition.
- `LaunchedEffect(userId)` - again when `userId` changes.
- Wrong keys → missed runs or infinite loops.

### `DisposableEffect`

For listeners that need dispose:

```kotlin
DisposableEffect(lifecycleOwner) {
    val observer = LifecycleEventObserver { _, event ->
        if (event == Lifecycle.Event.ON_START) player.play()
    }
    lifecycleOwner.lifecycle.addObserver(observer)
    onDispose {
        lifecycleOwner.lifecycle.removeObserver(observer)
    }
}
```

### `rememberCoroutineScope`

For **event-driven** work (button click), not for work that should auto-start:

```kotlin
val scope = rememberCoroutineScope()
Button(onClick = {
    scope.launch { snackbarHost.showSnackbar("Saved") }
}) { Text("Save") }
```

### `derivedStateOf`

When you compute from state that changes often but the **derived** result rarely does:

```kotlin
val listState = rememberLazyListState()
val showScrollUp by remember {
    derivedStateOf { listState.firstVisibleItemIndex > 5 }
}
```

Without `derivedStateOf`, every scroll delta could recompose heavy parents that only care about a boolean.

## Identity in lists

Lazy lists need stable identity to reuse compositions correctly:

```kotlin
LazyColumn {
    items(
        items = articles,
        key = { it.id },
    ) { article ->
        ArticleRow(article)
    }
}
```

Missing keys cause wrong item state when the list reorders (checkbox state jumping rows, animations glitching).

For items that host their own state, keys are not optional.

## Stability and recomposition performance (practical)

Compose skips recomposition of a composable when parameters are **stable** and equal.

Practical mid-level guidance:

- Prefer immutable data (`val` properties, immutable lists).
- Avoid passing rapidly changing objects into huge parents - hoist reads closer to leaves.
- Use `Modifier` chains carefully; allocate heavy objects in `remember`.
- Prefer `key(item.id) { ... }` when manually placing items outside Lazy APIs.

You do not need to memorize compiler stability inference tables on day one; you need to know **why** a whole screen recomposes on every keystroke (state read too high in the tree).

## Navigation and effects

Navigation is a one-off effect. Trigger it from events, not sticky state:

```kotlin
LaunchedEffect(Unit) {
    viewModel.events.collect { event ->
        when (event) {
            is Event.OpenDetail -> navController.navigate("detail/${event.id}")
        }
    }
}
```

Avoid navigating during composition based on a flag that remains true across recompositions without consumption.

## Interop notes

- `AndroidView` / `AndroidViewBinding` for legacy Views.
- `ComposeView` in Fragments with `DisposeOnViewTreeLifecycleDestroyed`.
- Collect flows with `collectAsStateWithLifecycle`, not bare `collectAsState`, when lifecycle matters.

## Common pitfalls

1. Side effects in composition without effect APIs.
2. `LaunchedEffect` missing keys → stale captures or never re-running.
3. Holding ViewModel state only in `remember` - lost on rotation.
4. Lazy lists without `key`.
5. Reading a high-frequency state at the root of a giant screen.
6. Using `rememberCoroutineScope` for load-on-enter instead of `LaunchedEffect`.

## How interviewers probe this

- “What is recomposition?”
- “`remember` vs `rememberSaveable` vs ViewModel?”
- “When does `LaunchedEffect` restart?”
- “Why keys in LazyColumn?”
- “How do you show a Snackbar once?”
- Performance: “typing in a search box recomposes the whole feed - what do you look for?”

## Practice checklist

1. Build a search screen: local `query` state, debounced ViewModel search, list keys.
2. Force a bug with missing list keys; fix it.
3. Migrate a composition-time analytics call into `LaunchedEffect`.
4. Profile recomposition with Layout Inspector / compose metrics if available.

## What you should be able to explain

- Composition as a function of state.
- State lifetime table with examples.
- Effect APIs and key semantics.
- List identity and state hoisting.

Next: **Architecture and the data layer** - where ViewModels, repositories, and models sit so Compose stays a renderer.
