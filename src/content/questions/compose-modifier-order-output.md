---
question: "Why does Modifier order change a composable's appearance?"
topic: jetpack-compose
difficulty: mid
tags: ["compose", "output-based", "modifier"]
---

```kotlin
// A
Box(Modifier.padding(16.dp).background(Color.Red).size(100.dp))

// B
Box(Modifier.background(Color.Red).padding(16.dp).size(100.dp))
```

**Result:**
- **A** - 16dp of *transparent* space, then a red 100dp box. The padding is applied **before** the background, so the background only covers the area inside the padding.
- **B** - a red box with 16dp of *red* padding inside it before the content. The background is applied **first**, so it fills the outer bounds, and padding insets the content within the red area.

**Why:** Modifiers are applied **in order, left to right** - each one wraps the result of the previous. The order literally is the order of operations:
- A: "add padding, *then* draw background inside that" → background sits inside the padded region.
- B: "draw background, *then* pad" → background covers everything, padding pushes content in.

**The general rule:** Compose modifiers are **not commutative**. `padding().background()` ≠ `background().padding()`. Also:
- `size()` then `padding()` vs `padding()` then `size()` changes whether padding is inside or outside the declared size.
- `clip()` before `background()` clips the background; after, it doesn't.
- `clickable()` before `padding()` makes the padded area clickable; after, only the inner area is.

**Interview takeaway:** "Modifiers compose like nested wrappers in declaration order - position `padding`, `background`, `clip`, and `clickable` deliberately."
