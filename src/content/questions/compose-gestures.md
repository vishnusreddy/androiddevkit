---
question: "How do you handle gestures and touch input in Compose?"
topic: jetpack-compose
difficulty: mid
order: 340
starred: false
section: "Everyday UI"
tags: ["compose", "gestures", "input"]
---

Compose offers gesture handling at two levels.

**High-level modifiers** for common cases:
```kotlin
Modifier
    .clickable { onClick() }
    .combinedClickable(onClick = {}, onLongClick = {})
    .draggable(state = rememberDraggableState { delta -> offset += delta },
               orientation = Orientation.Horizontal)
    .scrollable(...)
    .swipeable(...) // or anchoredDraggable in newer APIs
    .transformable(...) // pinch/zoom/rotate
```

**Low-level `pointerInput`** for custom gestures - gives raw pointer events and coroutine-based detectors:
```kotlin
Modifier.pointerInput(Unit) {
    detectTapGestures(
        onTap = { pos -> /* ... */ },
        onDoubleTap = { /* ... */ },
        onLongPress = { /* ... */ },
    )
}

Modifier.pointerInput(Unit) {
    detectDragGestures { change, dragAmount ->
        change.consume()
        offset += dragAmount
    }
}
```

Key points:
- **`pointerInput(key)`** restarts the gesture coroutine when the key changes - pass relevant state as the key (a common bug is `pointerInput(Unit)` capturing stale state).
- **Consume events** (`change.consume()`) to stop them propagating to parents and avoid conflicting gestures.
- Built-in detectors: `detectTapGestures`, `detectDragGestures`, `detectTransformGestures`, `awaitPointerEventScope { awaitFirstDown() ... }` for fully custom flows.
- For **accessibility**, prefer the semantic modifiers (`clickable` adds roles/handlers) over raw `pointerInput` where possible, or add `Modifier.semantics`.
