---
question: "How do you build a custom layout in Compose? Explain the measure/place model."
topic: jetpack-compose
difficulty: senior
tags: ["compose", "layout", "custom-layout"]
---

Use the **`Layout`** composable (or a `Modifier.layout`). Compose's layout protocol has one rule: **measure children once, then place them**. Constraints flow down, sizes flow up.

```kotlin
@Composable
fun SimpleColumn(content: @Composable () -> Unit, modifier: Modifier = Modifier) {
    Layout(content = content, modifier = modifier) { measurables, constraints ->
        // 1. Measure each child with constraints
        val placeables = measurables.map { it.measure(constraints) }

        // 2. Decide our own size
        val width = placeables.maxOf { it.width }
        val height = placeables.sumOf { it.height }

        // 3. Place children
        layout(width, height) {
            var y = 0
            placeables.forEach { p ->
                p.placeRelative(x = 0, y = y)
                y += p.height
            }
        }
    }
}
```

The three steps:
1. **Measure** — call `measurable.measure(constraints)` on each child **exactly once** (measuring twice throws). You may tighten/loosen the constraints you pass down.
2. **Size yourself** — call `layout(width, height)` based on children's measured sizes.
3. **Place** — inside the `layout {}` block, position each `Placeable` with `placeRelative`/`place`.

**Key concepts interviewers probe:**
- **Constraints** = min/max width and height passed top-down. A child must size within them.
- **Single-pass measurement** — Compose layout is single-pass for performance (no double measure like some View layouts), which is why measuring a child twice is an error.
- **`SubcomposeLayout`** — for the rare case where you must measure something *before* composing its children (e.g. `BoxWithConstraints`, lazy lists). It's more expensive; avoid unless needed.
- **Intrinsic measurements** (`Modifier.height(IntrinsicSize.Min)`) let a parent query a child's natural size when one-pass isn't enough.

**Soundbite:** "Custom layout = measure each child once with constraints, choose your size, place the placeables — single pass, constraints down, sizes up."
