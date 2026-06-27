---
question: "remember vs rememberSaveable - what's the difference?"
topic: jetpack-compose
difficulty: junior
tags: ["compose", "state"]
---

Both cache a value across recompositions, but they survive different events.

- **`remember`** keeps a value across **recompositions**. It's lost on configuration change (rotation) or process death, because the composition is recreated.
- **`rememberSaveable`** also persists across **configuration changes and process death** by writing into the saved-instance-state `Bundle`.

```kotlin
// Survives recomposition only
var query by remember { mutableStateOf("") }

// Also survives rotation / process death
var query by rememberSaveable { mutableStateOf("") }
```

Use `rememberSaveable` for UI state the user would be annoyed to lose - text fields, scroll position, expanded/collapsed flags. Use `remember` for things that are cheap to recreate or derived from other state.

**Gotcha:** `rememberSaveable` can only store types that go in a `Bundle` (primitives, `Parcelable`, etc.). For a custom type, provide a `Saver`.
