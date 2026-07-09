---
question: "What problem do Baseline Profiles solve, and how are they generated and applied?"
topic: platform-internals
difficulty: mid
order: 30
section: "Compilation and startup"
tags: ["baseline-profiles", "startup", "macrobenchmark", "performance"]
---

**The problem.** On a fresh install, ART compiles almost nothing ahead of time.
Your app starts interpreted, the JIT compiles hot methods only after it sees them
run, and it takes a few launches before the important startup and scrolling code
is AOT-compiled. Those first launches are the slowest, and first impressions are
exactly when you can least afford jank.

**What a Baseline Profile is.** It is a list of classes and methods that matter for
startup and critical user journeys, shipped **inside the APK** (compiled to a
binary profile the platform reads at install). At install time `dex2oat`
AOT-compiles the methods on that list, so the paths that drive your first frame are
already native the very first time the app runs. Reported gains are commonly in the
range of 20 to 30 percent faster cold start, plus smoother first scrolls.

**How you generate one.** You do not hand-write it. You exercise the real journeys
and let tooling record what ran:

- Write a **Macrobenchmark** test using `BaselineProfileRule` (or the **Baseline
  Profile Gradle plugin**) that launches the app and scrolls the key screens.
- Run it on a device or emulator. The tooling captures the executed methods and
  writes `baseline-prof.txt`.
- That profile is bundled into the release build, and Play also carries it so it
  applies at install.

**Two related ideas, so you do not confuse them:**

- **Startup Profiles** additionally influence how classes are laid out in the DEX
  so startup code is grouped together, reducing I/O during launch. They complement
  Baseline Profiles.
- **Cloud Profiles** are aggregated from real users by Play over time. They help,
  but only after your app has enough installs and usage. A Baseline Profile works
  from the first install, which is why you ship both rather than relying on the
  cloud alone.

**The honest caveat.** A Baseline Profile is only as good as the journeys you
record. If your benchmark only opens the home screen, only the home screen gets
pre-compiled. Cover the flows users actually hit on launch, and regenerate the
profile when those flows change, or it silently goes stale.

The summary line: a Baseline Profile pre-compiles your hot startup paths at install
time so the first launch is not stuck warming up, and you produce it by recording a
Macrobenchmark run rather than writing it by hand.
