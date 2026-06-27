---
question: "What are cold, warm, and hot starts, and how do you optimize app startup?"
topic: android-fundamentals
difficulty: mid
tags: ["startup", "performance"]
---

The three startup types, by how much already exists:

- **Cold start** - the process doesn't exist. The system creates the process, the `Application` object, then the first Activity. **Slowest** and the one you optimize.
- **Warm start** - the process is alive but the Activity must be recreated (e.g. user backed out then returned). Some work is reused.
- **Hot start** - the Activity is already in memory; just brought to the foreground. **Fastest** (mostly a redraw).

**What runs at cold start (and where time goes):**
`Application.onCreate()` → Activity `onCreate` → first frame drawn (time-to-initial-display).

**Optimizations:**
- **Trim `Application.onCreate`** - it runs on every cold start and blocks the first frame. **Lazy-initialize** SDKs; defer non-critical init off the critical path.
- **App Startup library** - consolidate `ContentProvider`-based library auto-initializers into one, and initialize lazily.
- **Avoid heavy work** in the first Activity's `onCreate`; load data async (coroutines) and show content progressively.
- **Baseline Profiles** - ship AOT-compiled profiles of startup/critical paths so the first runs aren't interpreted/JIT'd. Big, measurable win for cold start and scroll jank.
- **Modern Splash Screen API** (`androidx.core.splashscreen`) - a system splash you keep on screen until content is ready; avoid a separate splash *Activity* that adds a hop.
- **Reduce dependency graph work at startup** (DI graph creation), minimize `MultiDex` impact on older devices, and avoid synchronous disk/network.

**Measure with:**
- **`adb shell am start -W`** (reports `TotalTime`), **Macrobenchmark** (`StartupTimingMetric`), **Perfetto/system traces**, and **Android vitals** (startup time in production).
- Distinguish **time-to-initial-display (TTID)** from **time-to-full-display (TTFD)** - report TTFD with `reportFullyDrawn()`.
