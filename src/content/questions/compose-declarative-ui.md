---
question: "What is declarative UI, and how is Compose different from the View system?"
topic: jetpack-compose
difficulty: junior
tags: ["compose", "fundamentals", "declarative"]
---

**Declarative** means you describe *what* the UI should look like for a given state, and the framework figures out *how* to update the screen. You don't hold view references and mutate them; you re-describe the UI when state changes.

```kotlin
// Declarative (Compose): describe UI as a function of state
@Composable
fun Counter(count: Int, onIncrement: () -> Unit) {
    Button(onClick = onIncrement) { Text("Count: $count") }
}
```

vs the **imperative** View system, where you fetch a widget and mutate it:
```kotlin
button.text = "Count: $count"   // you manually keep the view in sync
```

Key differences:
- **No XML / no findViewById** — UI is Kotlin functions.
- **State-driven** — when state changes, Compose **recomposes** (re-invokes the affected composables) instead of you manually updating views.
- **No view hierarchy inflation** — composables don't map 1:1 to `View` objects; Compose maintains its own tree and renders directly.
- **Single source of truth** — the UI can't drift out of sync with state because it's derived from state.

**The mental model interviewers want:** `UI = f(state)`. Instead of imperatively poking widgets when data changes, you make the UI a pure function of state and let recomposition handle updates.
