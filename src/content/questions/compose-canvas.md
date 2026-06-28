---
question: "How do you do custom drawing in Compose? (Canvas, drawBehind, drawWithCache)"
topic: jetpack-compose
difficulty: mid
order: 320
starred: false
section: "Layout and modifiers"
tags: ["compose", "canvas", "drawing"]
---

Compose drawing happens in the **draw phase** via a `DrawScope`, which gives you `drawLine`, `drawCircle`, `drawPath`, `drawRect`, `drawImage`, etc. - all in pixels (`.toPx()` from dp).

**`Canvas` composable** - a dedicated drawing surface:
```kotlin
Canvas(Modifier.size(200.dp)) {
    drawCircle(color = Color.Red, radius = size.minDimension / 2)
    drawLine(Color.Black, start = Offset.Zero, end = Offset(size.width, size.height))
}
```

**`Modifier.drawBehind { }`** - draw behind a composable's content (e.g. a custom background):
```kotlin
Text("Hi", Modifier.drawBehind { drawRoundRect(Color.Yellow, cornerRadius = CornerRadius(8f)) })
```

**`Modifier.drawWithContent { }`** - control ordering relative to content (`drawContent()` places the children's drawing; draw before/after it). Great for overlays, scrims, masks.

**`Modifier.drawWithCache { }`** - **cache** expensive draw objects (paths, brushes, shaders) so they're not recreated every draw frame:
```kotlin
Modifier.drawWithCache {
    val path = buildExpensivePath(size)   // computed only when size changes
    onDrawBehind { drawPath(path, Color.Blue) }
}
```

**Performance notes:**
- Drawing is in the **draw phase**, so reading state inside a draw lambda (`drawBehind { }`) skips composition/layout - cheap for animations like progress bars.
- Use **`drawWithCache`** for anything costly to build (Paths, gradients) so it's rebuilt only when inputs change, not every frame.
- For very heavy/continuous graphics, `graphicsLayer` (and `RenderEffect`) offload work to the GPU.
