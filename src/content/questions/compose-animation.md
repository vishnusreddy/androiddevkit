---
question: "What are the main animation APIs in Compose, and how do you pick one?"
topic: jetpack-compose
difficulty: mid
tags: ["compose", "animation"]
---

Compose animations are **state-driven** — you animate *toward* a target value and Compose interpolates.

**High-level / value animations:**
- **`animate*AsState`** — animate a single value to a target. The simplest: `animateColorAsState`, `animateDpAsState`, `animateFloatAsState`.
  ```kotlin
  val size by animateDpAsState(if (expanded) 200.dp else 100.dp)
  Box(Modifier.size(size))
  ```
- **`updateTransition`** — coordinate **multiple** values that change together based on one state, staying in sync.
- **`AnimatedVisibility`** — animate a composable entering/leaving (enter/exit transitions: fade, slide, expand).
- **`AnimatedContent`** — animate the swap between different content for different states.
- **`Crossfade`** — fade between two layouts.
- **`animateContentSize()`** — a modifier that animates size changes automatically.

**Low-level / fine control:**
- **`Animatable`** — coroutine-driven, gives full control (e.g. fling, gesture-following, `snapTo`/`animateTo`), and is interruptible.
- **`rememberInfiniteTransition`** — looping animations (pulsing, loading shimmer).

**`AnimationSpec`** customizes the *how*: `tween(durationMillis, easing)`, `spring(dampingRatio, stiffness)`, `keyframes`, `repeatable`.

**How to choose:**
- One value to a target → **`animate*AsState`**.
- Several values from one state → **`updateTransition`**.
- Show/hide → **`AnimatedVisibility`**; swap content → **`AnimatedContent`**.
- Gesture-following / manual control → **`Animatable`**.
- Continuous loop → **`rememberInfiniteTransition`**.

**Soundbite:** "Animations are declarative — set a target, Compose animates to it. `animate*AsState` for one value, `updateTransition` for several, `Animatable` when you need imperative control."
