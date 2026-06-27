---
question: "Explain build types, product flavors, and build variants in Gradle."
topic: android-fundamentals
difficulty: mid
tags: ["gradle", "build", "flavors"]
---

Three related concepts let you produce multiple versions of an app from one codebase:

- **Build types** — *how* the app is built. Default `debug` and `release`; differ in signing, `minifyEnabled`, `debuggable`, `applicationIdSuffix`, etc. You can add custom ones (e.g. `staging`).
- **Product flavors** — *what* the app is. Different variants like `free`/`paid`, or `dev`/`prod` (different API endpoints, app names, feature sets). Grouped by **flavor dimensions**.
- **Build variant** = **build type × flavor**. With flavors `free`/`paid` and types `debug`/`release` you get four: `freeDebug`, `freeRelease`, `paidDebug`, `paidRelease`.

```kotlin
android {
    flavorDimensions += "tier"
    productFlavors {
        create("free")  { dimension = "tier"; applicationIdSuffix = ".free" }
        create("paid")  { dimension = "tier" }
    }
    buildTypes {
        getByName("release") { isMinifyEnabled = true; signingConfig = ... }
        create("staging")    { initWith(getByName("debug")); applicationIdSuffix = ".staging" }
    }
}
```

**What you control per variant:**
- **`applicationId`/suffix** — so debug/staging/free can install **alongside** release (different package names).
- **`buildConfigField`** and **`resValue`** — inject constants (API base URL, feature flags) and resources per variant.
- **Source sets** — `src/free/`, `src/debug/` directories override/add code and resources for that variant.
- **Signing configs**, ProGuard rules, manifest placeholders.

**Common real-world use:** `dev`/`prod` flavors pointing at different backends, a `staging` build type for QA, and `applicationIdSuffix` so testers keep prod + staging installed simultaneously.

**Soundbite:** "Build types = how you build (debug/release/staging), flavors = what you ship (free/paid, dev/prod); their product is the variant. Use `buildConfigField`, source sets, and `applicationIdSuffix` to vary endpoints, features, and let variants coexist on a device."
