---
question: "What is CompositionLocal? When should you use it (and when not)?"
topic: jetpack-compose
difficulty: senior
tags: ["compose", "compositionlocal", "theming"]
---

`CompositionLocal` provides a value **implicitly down the composition tree**, so deeply nested composables can read it without passing it through every parameter. It's how `MaterialTheme`, `LocalContext`, `LocalDensity`, and `LocalContentColor` work.

```kotlin
val LocalSpacing = compositionLocalOf { Spacing() }

CompositionLocalProvider(LocalSpacing provides Spacing(large = 24.dp)) {
    MyScreen()   // anything inside can read LocalSpacing.current
}

@Composable
fun MyScreen() {
    val spacing = LocalSpacing.current
    Column(Modifier.padding(spacing.large)) { ... }
}
```

**Two flavors:**
- **`compositionLocalOf`** — changing the value recomposes only composables that **read** it (tracked). Use for values that change.
- **`staticCompositionLocalOf`** — not tracked; changing it recomposes the **entire** provided subtree. Use for values that essentially never change (more efficient reads). Theme colors that rarely change often use this.

**When to use it:** truly cross-cutting, ambient data many layers deep — theming, density, locale, a logged-in user's display prefs.

**When NOT to use it (the part interviewers want):** it makes data flow **implicit**, which hurts readability and testability. Don't use it for:
- Data only one or two levels down — just pass a parameter.
- ViewModel/business state — pass it explicitly; CompositionLocal hides dependencies and makes composables harder to preview/test.

**Rule of thumb:** "CompositionLocal for ambient, rarely-changing, widely-needed values (theme, density). Explicit parameters for everything else."
