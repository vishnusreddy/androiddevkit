---
question: "Is code coverage a useful quality metric for Android tests?"
topic: testing-quality
difficulty: mid
order: 120
starred: false
section: "Reliability and CI"
tags: ["testing", "coverage", "mutation-testing", "quality"]
---

Coverage answers **which code executed**, not whether the assertions proved the
right behavior. A test can execute every line and assert nothing useful.

Use coverage as a diagnostic tool:

- Find important branches, error paths, and modules that receive no exercise.
- Review changed-code coverage when it helps identify an accidental blind spot.
- Set expectations by risk. Payment rules need stronger evidence than generated
  bindings or trivial model accessors.
- Exclude generated code deliberately and document why.

Avoid treating one repository-wide percentage as a target. It encourages tests
for easy lines, discourages refactoring, and says little about database schemas,
navigation graphs, resources, manifests, accessibility, or device behavior.

Branch coverage is often more informative than line coverage for state
transitions and error handling. Mutation testing goes further by changing
conditions or values and checking whether tests fail. Surviving mutations can
reveal weak assertions, but mutation runs are expensive and should focus on
critical pure logic.

A strong answer pairs modest coverage visibility with risk-based test design,
escaped-defect analysis, flake rate, and feedback time. The goal is confidence
and useful failures, not a decorative number.
