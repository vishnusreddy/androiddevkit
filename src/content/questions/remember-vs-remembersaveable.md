---
question: "What is the difference between remember and rememberSaveable?"
topic: jetpack-compose
difficulty: junior
order: 20
starred: true
section: "State fundamentals"
tags: ["compose", "state", "remember"]
---

Both keep a value across recompositions. The difference is what happens when the
composition itself is recreated.

```kotlin
var menuOpen by remember { mutableStateOf(false) }
var query by rememberSaveable { mutableStateOf("") }
```

- `remember` stores the value in the current composition. It is forgotten when
  that call leaves the composition, including after a configuration change that
  recreates the Activity.
- `rememberSaveable` also saves a compatible value through Android's saved-state
  mechanism. It can restore after configuration change and system-initiated
  process recreation.

Use `remember` for objects that are cheap to recreate or only meaningful while
the composable is present. Use `rememberSaveable` for small pieces of UI state a
user would notice losing, such as entered text, a selected tab, or an expanded
section.

There are two limits worth saying out loud:

1. `rememberSaveable` is not permanent storage. It does not replace Room or
   DataStore, and it will not restore state after the user deliberately removes
   the task.
2. The value must be saveable. Common primitives and `Parcelable` values work;
   custom types may need a `Saver`.

Also check the owner. Screen data and business state usually belong in a
`ViewModel`, with essential restoration inputs kept in `SavedStateHandle`.
`rememberSaveable` is mainly for UI element state.
