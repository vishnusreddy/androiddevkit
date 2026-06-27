---
question: "How do you design observability for a production mobile app? (crashes, ANRs, performance, logs)"
topic: system-design
difficulty: mid
tags: ["system-design", "observability", "monitoring", "quality"]
---

You can't fix what you can't see, and you don't control users' devices - so observability is essential.

**Crash & error reporting:**
- **Crashlytics** / Sentry / Bugsnag - capture crashes with **stack traces, breadcrumbs, device/OS/app-version**, and custom keys (user state, feature flags).
- Upload **R8 `mapping.txt`** so obfuscated stacks are **deobfuscated** - without it, production traces are unreadable.
- Log **non-fatal** exceptions (caught errors) to spot issues that don't crash but degrade UX.

**Stability metrics:**
- **Crash-free users/sessions** rate - the headline quality KPI.
- **ANR rate** - track via **Android vitals** (Play Console) and tooling; ANRs hurt ranking and retention.

**Performance monitoring:**
- **Startup time** (cold/warm), **frame rendering / jank** (`JankStats`, `FrameMetrics`), **network latency**, screen-load times.
- **Firebase Performance** / custom traces for key flows (`reportFullyDrawn`, custom spans).
- **Macrobenchmark** in CI to catch regressions before release; **Baseline Profiles** to improve.

**Analytics & business events** - funnels, feature adoption, drop-off (batched pipeline; see analytics design).

**Logging:**
- Structured, leveled logging; **strip verbose logs in release** (no PII, no tokens). Remote log collection for diagnosing reported issues.
- **Correlation IDs** to tie client requests to backend logs.

**Release safety:**
- **Staged rollouts** (1% → 100%) watching crash/ANR/vitals; **halt/rollback** on regression.
- **Remote kill switch** (feature flags) to disable a broken feature without a release.
- **Pre-launch reports** (Play) and device labs for coverage.
- **Alerting** on crash-rate spikes and ANR thresholds.

**Privacy:** consent, no PII in logs/analytics, respect opt-out and platform policies.

**Trade-offs to name:** logging verbosity (diagnosability vs noise/PII/size), sampling performance traces (cost vs fidelity), rollout speed (velocity vs risk).
