---
question: "What are the three Compose phases, and why do they matter?"
topic: jetpack-compose
difficulty: mid
order: 30
starred: true
section: "State and recomposition"
tags: ["compose", "phases", "performance"]
---

Compose updates UI through three main phases:

1. **Composition** decides what UI exists by running composable functions.
2. **Layout** measures each element and decides where it goes.
3. **Drawing** renders pixels.

The useful part is not memorizing the order. It is knowing that state reads are
tracked in the phase where they happen. A change can restart only the phase that
needs new work.

```kotlin
// Reads offset during composition
Box(Modifier.offset(x = scrollOffset.dp, y = 0.dp))

// Reads offset during layout
Box(
    Modifier.offset {
        IntOffset(x = scrollOffset, y = 0)
    }
)
```

For rapidly changing pixel values, the lambda overload can avoid composition
and go straight to layout. A value used only for color or a canvas operation can
often be read in a draw modifier.

Do not force every state read into a later phase. If a value changes which
composables exist, composition is exactly where it belongs. If it changes size,
layout still has to run.

**A solid performance answer:** identify what the state changes, find where it is
read, and check which phase actually needs to rerun. Then measure in a release
build before rewriting code.
