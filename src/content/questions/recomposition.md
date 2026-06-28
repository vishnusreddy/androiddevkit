---
question: "What triggers recomposition, and what work can Compose skip?"
topic: jetpack-compose
difficulty: mid
order: 15
starred: true
section: "State and recomposition"
tags: ["compose", "performance", "state", "recomposition"]
---

Recomposition is Compose rerunning composable code that may now describe stale
UI. The usual trigger is a write to observable state that was read during
composition.

```kotlin
@Composable
fun Greeting() {
    var name by remember { mutableStateOf("Asha") }

    Text("Hello, $name")
    Button(onClick = { name = "Ben" }) {
        Text("Change name")
    }
}
```

Compose records the read of `name`. When the value changes, it schedules the
recomposition scope that observed it. It does not blindly recreate the whole
screen.

Three terms are easy to mix up:

- **Scheduled** means Compose knows a scope may need another run.
- **Recomposed** means the composable code ran again.
- **Skipped** means Compose reused the previous result because the call's inputs
  met the skipping rules and were unchanged.

Keep recomposition cheap by keeping I/O and expensive calculation out of the
composable body. Read state in the smallest useful scope, provide stable item
identity, and defer a read to layout or drawing only when the value affects that
later phase.

Do not chase a zero recomposition count. A small, cheap recomposition is often
the intended update path. Investigate when traces show missed frames, expensive
work, or a much wider invalidation than the state change requires.

**Senior follow-up:** stability affects whether calls can be skipped, and strong
skipping allows restartable composables with unstable parameters to be skipped
when their parameter comparisons pass. It does not stop state reads inside the
scope from invalidating that scope.
