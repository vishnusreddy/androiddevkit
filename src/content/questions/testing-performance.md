---
question: "How do you test startup, scrolling, and other Android performance regressions?"
topic: testing-quality
difficulty: senior
order: 40
starred: true
section: "Specialized quality tests"
tags: ["testing", "macrobenchmark", "benchmark", "startup", "performance"]
---

Performance tests need a measurable user journey, a stable environment, and a
release-like build. Timing a debug build inside a unit test is not useful.

Use **Macrobenchmark** from a separate test module for whole-app journeys such
as cold startup, opening a heavy screen, or scrolling a feed. Measure startup
timing, frame timing, and traces while driving the app as a user would. Test
cold, warm, or hot startup deliberately rather than mixing them.

Use **Microbenchmark** for a small hot code path such as parsing, layout logic,
or a data transformation. It handles warmup and repeated measurement more
carefully than `measureTimeMillis`.

Good practice:

- Benchmark a release or benchmark build that is optimized and profileable.
- Use a controlled physical device when results gate releases. Emulators are
  useful for functional smoke tests but add noisy timing.
- Stabilize data, network responses, animations, thermal state, and background
  work as far as possible.
- Run enough iterations and compare distributions, not one number.
- Save traces so a regression can be diagnosed, not merely reported.
- Set thresholds from an established baseline and account for normal variance.

Baseline Profiles are an optimization, not the measurement itself. Generate or
ship them for critical journeys, then use Macrobenchmark to verify their effect.
CI can run a smaller regression set regularly, while broader device coverage
runs nightly or before release. Production Android vitals and field telemetry
remain necessary because a lab cannot represent every device.
