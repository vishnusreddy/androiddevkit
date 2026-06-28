---
question: "Why does Modifier order change layout, drawing, and touch behavior?"
topic: jetpack-compose
difficulty: mid
order: 70
starred: true
section: "Layout and modifiers"
tags: ["compose", "output-based", "modifier"]
---

Modifier order is behavior, not formatting. Each element in the chain wraps the
elements that follow it.

```kotlin
// A
Box(
    Modifier
        .padding(16.dp)
        .background(Color.Red)
        .size(100.dp)
)

// B
Box(
    Modifier
        .background(Color.Red)
        .padding(16.dp)
        .size(100.dp)
)
```

In A, the 16 dp outer area is not painted red. `padding` sits outside the
`background`. In B, the background sits outside the padding, so the padded area
is red too.

A good way to read a chain is from left to right as nested wrappers:

```text
A: padding(background(size(content)))
B: background(padding(size(content)))
```

The same rule changes interaction:

```kotlin
Modifier.clickable { }.padding(16.dp) // padding is inside the click target
Modifier.padding(16.dp).clickable { } // outer padding is not clickable
```

Size constraints need extra care. `size` requests a preferred size within the
constraints it receives; it is not an unconditional final pixel size. That is
why guessing only from the method names can be misleading.

**How to answer a modifier puzzle:** classify each modifier as layout, draw,
input, or semantics; rewrite the chain as wrappers; then work through the
constraints and bounds from the outside in.
