---
question: "What does R8 do? (shrinking, obfuscation, optimization) and what are keep rules?"
topic: android-fundamentals
difficulty: mid
tags: ["r8", "proguard", "build"]
---

**R8** is the default code shrinker/optimizer (it replaced ProGuard, reading the same `proguard-rules.pro` config). Enabled with `minifyEnabled true` on release builds, it does four things:

1. **Shrinking (tree-shaking)** — removes **unused** classes, methods, and fields. Smaller APK.
2. **Optimization** — inlining, removing dead branches, merging classes, simplifying code.
3. **Obfuscation** — renames classes/methods to short meaningless names (`a`, `b`) — smaller and harder to reverse-engineer.
4. **Resource shrinking** (`shrinkResources true`) — drops unused resources.

```kotlin
buildTypes {
    release {
        isMinifyEnabled = true
        isShrinkResources = true
        proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
    }
}
```

**The catch — reflection breaks under R8.** R8 does **static** analysis; code accessed only via **reflection, JNI, or by name** (Gson/Moshi models, deserialized classes, reflective DI, `Class.forName`) looks "unused" and gets removed or renamed. That's what **`-keep` rules** are for:

```proguard
-keep class com.app.model.** { *; }          # don't remove/rename my JSON models
-keepclassmembers class ... { @SerializedName <fields>; }
-keepattributes Signature, *Annotation*       # keep generics/annotations for reflection
```

**Points interviewers want:**
- **Always test the release/minified build** — bugs from over-aggressive removal only appear there (crashes like `NoSuchMethodException`, broken JSON parsing).
- Use libraries' **consumer ProGuard rules** (Retrofit/Gson/Moshi ship them) so you don't hand-write everything.
- **Keep mapping.txt** (`build/outputs/mapping`) — upload it to Play to **de-obfuscate crash stack traces**; without it, production crashes are unreadable.
- Prefer codegen (Moshi/kotlinx.serialization) over reflection to minimize keep rules.

**Soundbite:** "R8 shrinks, optimizes, obfuscates, and strips resources on release builds. Reflection-accessed code needs `-keep` rules or it gets removed/renamed — always test the minified build and retain `mapping.txt` to deobfuscate crashes."
