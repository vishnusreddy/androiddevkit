---
question: "What does declarative UI mean, and how is Compose different from Views?"
topic: jetpack-compose
difficulty: junior
order: 10
starred: true
section: "Mental model"
tags: ["compose", "fundamentals", "declarative"]
---

In a declarative UI, you describe what the screen should look like for the
current state. When the state changes, Compose runs the relevant composables
again and updates the UI.

```kotlin
@Composable
fun Counter(count: Int, onIncrement: () -> Unit) {
    Button(onClick = onIncrement) {
        Text("Count: $count")
    }
}
```

`Counter` does not find a text view and change its text. It simply says, "for
this value of `count`, show this button." A useful shorthand is:

```text
UI = f(state)
```

The View system is usually imperative. Code keeps references to widgets and
updates them directly:

```kotlin
countText.text = "Count: $count"
incrementButton.isEnabled = count < 10
```

The practical differences are:

- Compose UI is written in Kotlin rather than inflated from XML.
- State is the source of truth. The UI is derived from it.
- A composable call does not correspond one-to-one with an Android `View`.
- Recomposition can rerun a function, skip it, or discard the result, so the
  composable body should be free of uncontrolled side effects.

An interview answer should not stop at "Compose has no XML." The important
change is ownership: application state drives the UI, instead of UI objects
quietly becoming another place where state lives.

**Senior follow-up:** declarative does not mean Compose rebuilds the whole screen
for every change. The runtime tracks state reads and can recompose a small scope,
then skip layout or drawing work that is still valid.
