---
question: "How do you use @Preview effectively, and what makes a composable preview-friendly?"
topic: jetpack-compose
difficulty: junior
tags: ["compose", "preview", "tooling"]
---

`@Preview` renders a composable in Android Studio **without running the app or a device** - fast iteration on UI.

```kotlin
@Preview(showBackground = true)
@Preview(name = "Dark", uiMode = Configuration.UI_MODE_NIGHT_YES)
@Preview(name = "Large font", fontScale = 1.5f)
@Composable
private fun ProfileCardPreview() {
    AppTheme {
        ProfileCard(user = User("Ada", "ada@x.com"))
    }
}
```

Useful features:
- **Multiple previews** on one function (light/dark, font scales, locales, device sizes) - or a **`@PreviewParameter`** provider to render several data states (loading/empty/error/loaded) at once.
- **Custom annotation classes** (`@PreviewLightDark`, or your own multi-preview annotation) to apply a standard set everywhere.
- **Interactive Preview** and **Live Edit** for clicking through and editing without rebuilds.

**What makes a composable preview-friendly (the real point):**
- It must be **stateless / driven by parameters** - a composable that fetches data from a ViewModel or reads a real repository **can't** preview cleanly. Hoist state and pass plain data.
- Wrap previews in your **theme** so colors/typography render correctly.
- Pass **fake/sample data** rather than real dependencies.

This is a strong argument for the **stateless composable + state hoisting** pattern: previewability falls out of it for free. A screen split into a stateful "screen" (wires the ViewModel) and a stateless "content" (pure params) lets you preview the content in every state.

**Bonus:** previews double as **screenshot tests** (Paparazzi/Roborazzi) to catch visual regressions in CI without a device.
