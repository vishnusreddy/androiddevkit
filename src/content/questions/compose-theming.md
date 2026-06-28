---
question: "How does theming work in Compose?"
topic: jetpack-compose
difficulty: junior
order: 60
starred: false
section: "Everyday UI"
tags: ["compose", "theming", "material"]
---

`MaterialTheme` provides three systems down the tree via CompositionLocals: **colors**, **typography**, and **shapes**.

```kotlin
@Composable
fun AppTheme(darkTheme: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) {
    val colors = when {
        // Material 3 dynamic color (Android 12+): derive from the wallpaper
        dynamicColorAvailable() && darkTheme -> dynamicDarkColorScheme(LocalContext.current)
        dynamicColorAvailable() -> dynamicLightColorScheme(LocalContext.current)
        darkTheme -> DarkColors
        else -> LightColors
    }
    MaterialTheme(colorScheme = colors, typography = AppTypography, content = content)
}
```

Reading the theme anywhere inside:
```kotlin
Text("Hi", color = MaterialTheme.colorScheme.primary,
     style = MaterialTheme.typography.titleMedium)
```

Key points:
- **Single source of truth** - define colors/type/shapes once; components read from `MaterialTheme.*`. Don't hardcode colors in composables.
- **Dark mode** is just a different `ColorScheme`. `isSystemInDarkTheme()` follows the system; toggling is swapping the scheme - the whole tree recomposes with new colors.
- **Dynamic color (Material You)** derives a scheme from the user's wallpaper on Android 12+. Provide static fallbacks for older versions.
- **Custom design systems** - wrap or replace `MaterialTheme` with your own `CompositionLocalProvider`s (custom spacing, brand colors) and expose them via a `Theme` object.
- Theme values flow through **`staticCompositionLocalOf`**, so reads are cheap but changing the theme recomposes the provided subtree.
