---
question: "How do you handle window insets and edge-to-edge in Compose?"
topic: jetpack-compose
difficulty: mid
tags: ["compose", "insets", "edge-to-edge"]
---

**Insets** are the system-reserved areas — status bar, navigation bar, IME (keyboard), display cutout. With edge-to-edge (default on Android 15+ when targeting SDK 35), your content draws behind the system bars, so you must apply insets so nothing important is hidden.

```kotlin
// Enable edge-to-edge in the Activity
enableEdgeToEdge()

// Apply insets as padding in Compose
Column(
    Modifier
        .fillMaxSize()
        .windowInsetsPadding(WindowInsets.systemBars)   // pad for status+nav bars
) { ... }
```

Common tools:
- **`Modifier.windowInsetsPadding(WindowInsets.systemBars)`** / `.statusBarsPadding()` / `.navigationBarsPadding()` — pad content out of the system bars.
- **`Modifier.imePadding()`** — pad for the keyboard so inputs aren't covered; **`Modifier.safeDrawingPadding()`** covers all of the above.
- **`Scaffold`** automatically supplies `contentPadding` accounting for its bars — apply it to the content.
- **`WindowInsets.ime`** / `navigationBarsPadding` for fine control; `.consumeWindowInsets()` to avoid double-applying in nested layouts.

**Edge-to-edge points interviewers want:**
- You typically want backgrounds to extend **behind** the bars (immersive look) but pad **interactive/text content** so it's not under them — apply insets at the content level, not the root background.
- Handle the **IME** with `imePadding()` (and `adjustResize`-style behavior is automatic in Compose).
- Test with gesture nav, 3-button nav, and a display cutout.

**Soundbite:** "Enable edge-to-edge, then apply insets as padding (`windowInsetsPadding`, `imePadding`, `safeDrawingPadding`) so content clears the system bars and keyboard while backgrounds still draw behind them."
