---
question: "What is the slot API pattern (content lambdas) in Compose?"
topic: jetpack-compose
difficulty: mid
tags: ["compose", "slot-api", "reusability"]
---

The **slot API** is the pattern of accepting `@Composable` lambdas as parameters, letting callers inject their own content into named "slots." It's how Compose builds flexible, reusable components without exploding into dozens of configuration parameters.

```kotlin
@Composable
fun Card(
    title: @Composable () -> Unit,
    actions: @Composable RowScope.() -> Unit = {},
    content: @Composable () -> Unit,
) {
    Column(Modifier.padding(16.dp)) {
        title()
        Spacer(Modifier.height(8.dp))
        content()
        Row { actions() }
    }
}

// Caller fills the slots with whatever it wants
Card(
    title = { Text("Profile", style = MaterialTheme.typography.titleLarge) },
    actions = { TextButton(onClick = {}) { Text("Edit") } },
) {
    ProfileBody()
}
```

You see this everywhere in Material: `Scaffold(topBar = {}, bottomBar = {}, floatingActionButton = {}) { content }`, `Button(content = { })`, `TopAppBar(title, navigationIcon, actions)`.

**Why it's powerful:**
- **Inversion of control** — the component owns layout/behavior; the caller owns *what* goes inside. No boolean/enum config soup.
- **Reusable & composable** — one `Card` serves countless use cases.
- **`RowScope`/`ColumnScope` receivers** on a slot give the caller scoped modifiers (`Modifier.weight`, `align`) inside that slot.
- **Trailing-lambda ergonomics** — the last `content` slot reads cleanly with `{ }`.

**Soundbite:** "Slot APIs accept composable lambdas as parameters so callers inject content — inversion of control that makes components reusable without parameter bloat."
