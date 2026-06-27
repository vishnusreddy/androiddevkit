---
question: "Dalvik vs ART, and what are AOT, JIT, and baseline profiles?"
topic: android-fundamentals
difficulty: senior
tags: ["art", "dalvik", "runtime", "performance"]
---

The short answer is that modern Android uses **ART**. Dalvik is useful history,
but Junior and Mid candidates should focus on why current apps use a mix of JIT,
AOT, and profiles.

**Dalvik** was Android's original runtime before Android 5. It compiled code as
the app ran using JIT, or Just-In-Time compilation.

**ART (Android Runtime)** replaced it (Android 5+) and has evolved:
- **Android 5–6:** **full AOT** - the entire app was compiled to native code **at install time**. Fast execution, but **slow installs** and large storage.
- **Android 7+ (the current hybrid):** **JIT + AOT + profile-guided compilation**. The app runs interpreted/JIT first; ART **profiles** which methods are hot, and during idle/charging it **AOT-compiles just those hot paths**. Best of both - fast installs, and frequently-used code gets compiled over time.

**The terms:**
- **AOT (Ahead-Of-Time)** - compile to native **before** running (install or build time). Fast at runtime, costs install time/space.
- **JIT (Just-In-Time)** - compile **while** running, for hot code. No install cost, but first runs are slower (interpreted).
- **Profile-guided** - collect which methods are hot, then AOT-compile those.

**Baseline Profiles** list important code paths such as startup and scrolling.
Shipping that list lets ART compile those paths earlier instead of waiting to
learn them from usage. The result can be faster first launches and smoother
critical interactions. Macrobenchmark tooling can generate and verify them.

**Other ART facts:**
- ART executes **DEX** (Dalvik Executable) bytecode - Kotlin/Java → `.class` → **`.dex`** (via D8) → optimized by R8.
- It has **improved GC** over Dalvik (concurrent, less pause).
