---
question: "Trace the compilation pipeline from Kotlin source to code running on the device. Where do D8, R8, and dex2oat fit?"
topic: platform-internals
difficulty: senior
order: 60
section: "Compilation and startup"
tags: ["dex", "dex2oat", "d8", "r8", "art", "compilation"]
---

There are two halves to this: what happens at **build time** on your machine, and
what happens **on the device** at install and run time.

**Build time (on your machine):**

1. **Kotlin (or Java) to `.class`.** `kotlinc` and `javac` compile source to JVM
   bytecode.
2. **`.class` to `.dex` via D8.** Android does not run JVM bytecode directly. **D8**
   converts `.class` files into **DEX** (Dalvik Executable) bytecode, the format
   ART actually loads, and also **desugars** newer language features so they run on
   older devices.
3. **R8 on release builds.** **R8** replaces the old ProGuard and does shrinking,
   optimization, and obfuscation while producing the DEX, using your
   `proguard-rules.pro` keep rules. Debug builds usually skip this.

The APK (or the modules of an AAB) ships this DEX bytecode. It is still bytecode,
not native code.

**Device time (install and run):**

4. **`dex2oat` at install.** When the app is installed, the on-device compiler
   **`dex2oat`** can compile DEX ahead of time into native code, producing `.oat`
   (compiled native code) and `.vdex` (verified DEX) files, plus an `.art` image of
   preloaded objects. The default compilation mode is **`speed-profile`**, which
   means "compile the methods a profile says are hot," not the whole app.
5. **Interpret, then JIT, then AOT.** With no profile yet, methods start
   **interpreted**. ART's **JIT** compiles methods that turn out to be hot and
   records them into a profile. Later, during idle and charging, a background job
   runs `dex2oat` again to **AOT-compile** those hot methods so future launches
   skip the warmup. This hybrid is why modern installs are fast (little is compiled
   up front) yet frequently used code becomes native over time.

**Where Baseline Profiles plug in.** A Baseline Profile ships a ready-made list of
hot methods in the APK, so `dex2oat` can AOT-compile the important startup and
scrolling paths **at install time** instead of waiting for the device to learn them
from usage. That is why they improve the very first launches.

The mental model to state: source to DEX happens at build (D8 converts, R8
shrinks and obfuscates), and DEX to native happens on device through `dex2oat`,
guided by profiles, with a JIT filling in until AOT catches up.
