---
question: "What is state hoisting, and where should Compose state live?"
topic: jetpack-compose
difficulty: junior
order: 30
starred: true
section: "State fundamentals"
tags: ["compose", "state-hoisting", "state", "udf"]
---

State hoisting means moving state to the caller and giving the child its current
value plus events it can raise. People often summarize it as **state down,
events up**.

```kotlin
@Composable
fun SearchField(
    query: String,
    onQueryChange: (String) -> Unit,
) {
    TextField(value = query, onValueChange = onQueryChange)
}
```

`SearchField` is stateless. That makes it easy to preview, test, and reuse. The
caller can keep `query` locally, in a plain state holder, or in a `ViewModel`.

A practical placement rule is to hoist state:

- to the lowest common parent of everything that reads it
- high enough to include everything that can change it
- together with other state that must change from the same events

Do not hoist by reflex. A tooltip's open flag or a self-contained animation can
stay local when no caller needs to control it. Screen state shaped by business
logic usually belongs in a screen-level state holder such as a `ViewModel`.

```kotlin
@Composable
fun SearchRoute(viewModel: SearchViewModel = viewModel()) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    SearchScreen(
        state = state,
        onQueryChange = viewModel::onQueryChange,
    )
}
```

The strongest interview answer explains ownership, not just the
`value`/`onValueChange` signature. Ask who needs to read the state, who changes
it, and how long it must survive.
