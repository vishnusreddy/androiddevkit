---
question: "How would you scale Android tests in CI for a large multi-module app?"
topic: testing-quality
difficulty: senior
order: 50
starred: false
section: "Reliability and CI"
tags: ["testing", "ci", "modularization", "device-farm", "quality"]
---

Optimize for fast, trustworthy feedback first, then broader confidence.

**On every pull request:** run formatting, static analysis, compilation, and
local tests for affected modules. Add component or feature tests for changed
boundaries. Cache dependencies and build outputs carefully, and shard large test
sets using historical timing rather than file count.

**Before merge:** run a small emulator matrix and critical feature flows. Use a
known device image, disable animations where the test does not cover them, keep
fixtures isolated, and publish logs, screenshots, video, and test reports on
failure.

**After merge or nightly:** run application journeys, migration tests, broader
API levels and form factors, accessibility checks, screenshots, and performance
benchmarks. Reserve the widest device-farm matrix for release candidates.

Track suite health as a product:

- Median and tail feedback time.
- Failure and flake rate by test and owner.
- Quarantined tests with an owner and expiry date.
- Regressions escaped by each test layer.
- Slowest modules and journeys.

Retries can expose whether a failure is flaky, but a green retry must not erase
the signal. Fix or quarantine the test with a deadline. Avoid a single giant
end-to-end stage that blocks every change for an hour. A test suite that teams
stop trusting has almost no protective value.
