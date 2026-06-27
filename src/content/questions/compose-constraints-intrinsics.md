---
question: "What are constraints, intrinsic measurements, and BoxWithConstraints?"
topic: jetpack-compose
difficulty: senior
tags: ["compose", "layout", "constraints"]
---

**Constraints** are the min/max width and height a parent passes to a child during the layout phase. A child must choose a size within them. They flow **top-down**; measured sizes flow **bottom-up**.

```kotlin
Layout(content) { measurables, constraints ->
    // constraints.maxWidth, minHeight, etc.
}
```

**The single-pass rule** means a parent normally can't know a child's size before measuring it. Two escape hatches:

**Intrinsic measurements** - query a child's "natural" size without a full measure pass. `Modifier.height(IntrinsicSize.Min)` makes a Row tall enough for its tallest child, etc. Used when one child's size should depend on a sibling's natural size (e.g. a divider matching text height). It costs an extra measurement, so use sparingly.

```kotlin
Row(Modifier.height(IntrinsicSize.Min)) {
    Text("Left")
    Divider(Modifier.fillMaxHeight().width(1.dp))   // matches the Row's content height
    Text("Right")
}
```

**`BoxWithConstraints`** - exposes the incoming constraints **inside** the composable so you can compose different content based on available space:

```kotlin
BoxWithConstraints {
    if (maxWidth < 600.dp) PhoneLayout() else TabletLayout()
}
```
It's built on **`SubcomposeLayout`** (it composes children *after* knowing constraints), which is **more expensive** than a normal layout - don't reach for it when a regular `Modifier`/`weight` approach works. Prefer it only for genuine "I must know the size before deciding what to compose" cases (responsive/adaptive layouts).
