---
question: "How do you write a custom Modifier, and why prefer Modifier.Node over composed { }?"
topic: jetpack-compose
difficulty: senior
tags: ["compose", "modifier", "performance"]
---

A simple custom modifier is just a chaining extension that combines existing modifiers:

```kotlin
fun Modifier.card() = this
    .clip(RoundedCornerShape(12.dp))
    .background(MaterialTheme.colorScheme.surface)
    .padding(16.dp)
```

For modifiers that need **state or to participate in layout/draw**, there are two approaches:

**`Modifier.composed { }`** (legacy) - lets you call composable functions (like `remember`) inside a modifier. The problem: it's a **factory that recomposes**, doesn't get inlined/optimized well, allocates per use, and can hurt performance.

**`Modifier.Node`** (modern, recommended) - a lower-level API where you implement a `Modifier.Node` and a `ModifierNodeElement`. It's **more efficient**: nodes are long-lived, not recreated on recomposition, can directly implement `DrawModifierNode`, `LayoutModifierNode`, `PointerInputModifierNode`, etc., and avoid the composition overhead of `composed`.

```kotlin
fun Modifier.circleBorder(color: Color) = this then CircleBorderElement(color)

private data class CircleBorderElement(val color: Color) :
    ModifierNodeElement<CircleBorderNode>() {
    override fun create() = CircleBorderNode(color)
    override fun update(node: CircleBorderNode) { node.color = color }
}

private class CircleBorderNode(var color: Color) : DrawModifierNode, Modifier.Node() {
    override fun ContentDrawScope.draw() {
        drawContent()
        drawCircle(color, style = Stroke(2.dp.toPx()))
    }
}
```

**Why this matters:** Google migrated all built-in modifiers off `composed` to `Modifier.Node` for performance. Knowing to prefer `Modifier.Node` (and that `composed { }` is discouraged for stateful/drawing modifiers) signals you understand Compose performance at a deeper level.

**Rule of thumb:** plain chaining for stateless combos; **`Modifier.Node`** for anything stateful, drawing, or layout-affecting; avoid `composed { }` in new code.
