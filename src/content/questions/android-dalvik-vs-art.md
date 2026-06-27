---
question: "Dalvik vs ART, and what are AOT, JIT, and baseline profiles?"
topic: android-fundamentals
difficulty: senior
tags: ["art", "dalvik", "runtime", "performance"]
---

**Dalvik** was the original Android runtime (pre-5.0): a **register-based VM** that used **JIT** (Just-In-Time) compilation — bytecode compiled to native code **at runtime**, repeatedly, on each run.

**ART (Android Runtime)** replaced it (Android 5+) and has evolved:
- **Android 5–6:** **full AOT** — the entire app was compiled to native code **at install time**. Fast execution, but **slow installs** and large storage.
- **Android 7+ (the current hybrid):** **JIT + AOT + profile-guided compilation**. The app runs interpreted/JIT first; ART **profiles** which methods are hot, and during idle/charging it **AOT-compiles just those hot paths**. Best of both — fast installs, and frequently-used code gets compiled over time.

**The terms:**
- **AOT (Ahead-Of-Time)** — compile to native **before** running (install or build time). Fast at runtime, costs install time/space.
- **JIT (Just-In-Time)** — compile **while** running, for hot code. No install cost, but first runs are slower (interpreted).
- **Profile-guided** — collect which methods are hot, then AOT-compile those.

**Baseline Profiles** tie this together for interviews: you ship a **precomputed profile** of critical-path methods (startup, scrolling, key flows) with your app. ART AOT-compiles those methods **at install time** instead of waiting to discover them at runtime — so the **first** launches and interactions are already fast (no JIT warm-up). Measurably improves cold start and scroll jank. Generate them with the Macrobenchmark library; they apply to your code **and** libraries (including Compose).

**Other ART facts:**
- ART executes **DEX** (Dalvik Executable) bytecode — Kotlin/Java → `.class` → **`.dex`** (via D8) → optimized by R8.
- It has **improved GC** over Dalvik (concurrent, less pause).

**Soundbite:** "Dalvik = JIT-only register VM; ART = hybrid JIT + profile-guided AOT. AOT compiles before running, JIT during; Baseline Profiles pre-seed the hot paths so the first runs are AOT-fast instead of waiting for JIT."
