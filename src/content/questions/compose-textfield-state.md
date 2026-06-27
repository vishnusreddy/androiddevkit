---
question: "How do you manage TextField state in Compose, and what is the recomposition concern?"
topic: jetpack-compose
difficulty: mid
tags: ["compose", "textfield", "state"]
---

A `TextField` is **stateless** — it shows the `value` you give it and reports edits via `onValueChange`. You own the state (state hoisting):

```kotlin
var text by rememberSaveable { mutableStateOf("") }
TextField(value = text, onValueChange = { text = it })
```

`rememberSaveable` keeps the text across rotation/process death.

**The recomposition concern:** every keystroke updates the state, which recomposes the `TextField` (and anything reading `text`). For most screens that's fine. Problems appear when:
- `onValueChange` routes through a **ViewModel + StateFlow** round-trip — the extra hop can cause **lag or cursor jumps** if updates are async or debounced incorrectly. Keep the text state close to the field (often local `rememberSaveable`), and send only *derived* actions (search query) to the ViewModel via `debounce`.
- Heavy work runs in `onValueChange` — keep it light; do validation/search reactively (e.g. `snapshotFlow { text }.debounce(300)`).

**The modern API — `TextFieldState`** (Compose Foundation `BasicTextField` with state-based API) manages text, selection, and composition more robustly than the value/callback pair, avoiding a class of cursor/state desync bugs:

```kotlin
val state = rememberTextFieldState()
BasicTextField(state = state)
// read with state.text
```

**Key points:**
- Hoist text with `rememberSaveable` for config-change survival.
- Don't introduce async latency between keystroke and displayed value — it causes janky typing/cursor jumps.
- Prefer the newer `TextFieldState` API for complex inputs; it handles selection/IME edge cases.
- Use `KeyboardOptions`/`KeyboardActions` for input type and IME actions, and `visualTransformation` for masking (passwords, currency).
