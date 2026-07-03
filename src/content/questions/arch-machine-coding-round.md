---
question: "How should you approach an Android machine-coding or take-home round?"
topic: architecture
difficulty: mid
order: 240
starred: true
section: "Architecture judgment"
tags: ["machine-coding", "architecture", "interview", "code-review"]
---

The goal is not to build the largest app. It is to deliver a small, working
slice that is easy to explain, test, and extend.

**Before coding:** clarify required screens, data source, offline behavior,
loading and error states, time limit, allowed libraries, and what reviewers will
run. Write assumptions in the README if the prompt is ambiguous.

**Build in vertical slices:** get one end-to-end path working first.

![Simple vertical slice for an Android machine-coding exercise](/diagrams/machine-coding-flow.svg)

Start with the simplest architecture that provides clear ownership. A single
app module, one repository, immutable UI state, and dependency injection at a
small composition root may be enough. Add Room, pagination, use cases, or more
modules only when the requirements need them.

**A practical order under time pressure:**

1. Make the project compile and run.
2. Implement the happy path from data to rendered UI.
3. Add loading, empty, error, and retry behavior.
4. Handle rotation and any required persistence.
5. Add a few high-value tests around state and data policy.
6. Polish accessibility, cancellation, and edge cases.
7. Document trade-offs and what you would do next.

Reviewers look for readable naming, lifecycle-safe collection, no main-thread
I/O, cancellation, stable list identity, test seams, and sensible Git history.
They also notice whether the app works after a clean clone.

Avoid speculative abstraction, copied boilerplate, a framework for every layer,
and spending half the exercise on visual polish while failure states are broken.
If time expires, a working narrow solution with explicit next steps is stronger
than an unfinished grand architecture.

During review, explain why each boundary exists and be ready to change a
requirement. The best signal is not perfection. It is controlled scope and sound
engineering judgment.
