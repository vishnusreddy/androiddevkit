---
question: "How should text field state be managed in modern Compose?"
topic: jetpack-compose
difficulty: mid
order: 110
starred: false
section: "Everyday UI"
tags: ["compose", "textfield", "state", "input"]
---

Compose has value-based and state-based text field APIs. Know both, because many
codebases still use the value-based form:

```kotlin
var text by rememberSaveable { mutableStateOf("") }

TextField(
    value = text,
    onValueChange = { text = it },
)
```

This is controlled input. The field reports an edit, and the caller must provide
the updated value on the next composition. Delaying that round trip through
asynchronous `ViewModel` work can cause lost edits or cursor jumps.

For new code, state-based fields are designed to manage text, selection, and IME
composition together:

```kotlin
val textState = rememberTextFieldState()

TextField(
    state = textState,
    lineLimits = TextFieldLineLimits.SingleLine,
)
```

`rememberTextFieldState()` includes save and restore support. State-based APIs
also separate input changes from display transformation, which avoids changing
the backing text just to format what the user sees.

Keep immediate editing state close enough to the field to update synchronously.
Send meaningful events or a debounced query to the `ViewModel` when business
logic needs it. Do not run network requests or heavy validation directly in an
edit callback.

For an interview, also mention selection, IME composition, keyboard actions,
accessibility, and restoration. A text field stores more than a `String`, which
is why complex input benefits from `TextFieldState`.
