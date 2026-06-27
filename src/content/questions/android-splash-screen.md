---
question: "How should you implement a splash screen on modern Android?"
topic: android-fundamentals
difficulty: junior
tags: ["splash-screen", "startup"]
---

Use the **`androidx.core:core-splashscreen`** library / the **SplashScreen API** (standardized in Android 12), **not** a dedicated splash Activity.

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        val splash = installSplashScreen()    // BEFORE super.onCreate / setContentView
        super.onCreate(savedInstanceState)

        // Keep the splash visible until data is ready
        splash.setKeepOnScreenCondition { viewModel.isLoading.value }
    }
}
```
Configure the icon/background via a theme:
```xml
<style name="Theme.App.Starting" parent="Theme.SplashScreen">
    <item name="windowSplashScreenBackground">@color/brand</item>
    <item name="windowSplashScreenAnimatedIcon">@drawable/logo</item>
    <item name="postSplashScreenTheme">@style/Theme.App</item>
</style>
```

**Why not a splash Activity (the old anti-pattern):**
- It adds an **extra Activity** and transition → **slower** startup, the opposite of the goal.
- A fake fixed-duration splash (`postDelayed`) **wastes the user's time**.
- The system already shows a launch window; a separate Activity just delays content.

**Best practices:**
- The splash should cover **actual startup work**, not an artificial timer. Use `setKeepOnScreenCondition` to hold it only while genuinely loading critical data.
- Keep it **brief** — if startup is slow, fix startup (lazy init, Baseline Profiles), don't pad it with a splash.
- Provide an **animated icon** + brand background through the theme; it integrates with the system launch animation seamlessly.
- On pre-12 devices the library backports the same behavior.

**Soundbite:** "Use the SplashScreen API (`installSplashScreen` + a `Theme.SplashScreen`), not a separate splash Activity. Hold it with `setKeepOnScreenCondition` only while real loading happens — never a fixed timer, which just slows users down."
