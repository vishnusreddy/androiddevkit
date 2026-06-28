---
question: "How do you investigate a slow or janky Compose screen?"
topic: jetpack-compose
difficulty: mid
order: 90
starred: true
section: "Performance"
tags: ["compose", "performance", "recomposition", "benchmarking"]
---

Start with evidence. A useful answer is a small investigation plan, not a bag of
`remember` calls.

1. Reproduce the exact interaction, such as first scroll, list fling, or opening
   a detail screen.
2. Measure a release-like, non-debuggable build. Debug Compose performance is
   not representative.
3. Capture frame timing with Macrobenchmark or a system trace. Composition
   tracing can identify expensive composable work.
4. Use compiler reports and Layout Inspector when the evidence points to
   unnecessary recomposition or unstable parameters.
5. Change one cause and measure again.

Common causes include:

- sorting, parsing, allocation, or I/O in a composable body
- reading fast-changing state higher in the tree than necessary
- reading layout-only or draw-only state during composition
- missing lazy-list keys or incompatible content being reused together
- image decoding, synchronous binder work, or another cost outside Compose
- startup code that would benefit from a Baseline Profile

Fix the cause you measured. Cache a genuinely expensive pure calculation with
the inputs as `remember` keys. Use `derivedStateOf` when a rapidly changing input
produces an output that changes much less often. Use lambda modifiers such as
`offset { ... }` when the state only affects a later phase.

Do not treat recomposition count as a score. Recomposition is normal and often
cheap. The problem is expensive work on a critical frame, invalidating too much
UI, or rerunning a phase that was avoidable.

**Senior follow-up:** include startup, memory allocation, image loading, and the
View or platform boundary in the trace. A screen can be janky even when its
Compose stability report looks perfect.
