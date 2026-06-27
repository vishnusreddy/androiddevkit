---
question: "What are the three phases of Jetpack Compose?"
topic: jetpack-compose
difficulty: mid
tags: ["compose", "phases", "performance"]
---

Compose renders a frame in three phases, in order:

1. **Composition** - *what* to show. Compose runs your `@Composable` functions to build/update the UI tree (the description of widgets). This is where recomposition happens.
2. **Layout** - *where* to put it. Each node is measured and placed: the tree is measured top-down, then children are placed. This is the measure/place pass.
3. **Drawing** - *how* it looks. Each node draws itself onto the canvas.

```
State change → Composition → Layout → Drawing → frame on screen
```

**Why this matters for performance:** a state change doesn't always need all three phases. If you can **defer a state read to a later phase**, you skip the earlier ones:

```kotlin
// ❌ reads scroll offset in composition → recomposes every scroll frame
Box(Modifier.offset(x = scrollState.value.dp))

// ✅ reads it in the layout phase via a lambda → skips composition
Box(Modifier.offset { IntOffset(scrollState.value, 0) })
```

The lambda version of `offset`/`graphicsLayer`/`drawBehind` reads the value during **layout/draw**, not composition - so a changing offset re-runs only layout/draw, not your composable. This deferred-read technique is a core Compose performance pattern.
