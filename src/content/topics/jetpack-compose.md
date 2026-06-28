---
title: Jetpack Compose
description: Build a solid Compose mental model, then use it to reason about state, recomposition, effects, layouts, lists, and performance.
category: Android
order: 20
icon: "◧"
---

Compose interviews get much easier once you stop treating every API as a fact to
memorize. Most questions come back to the same few ideas: UI is produced from
state, Compose tracks where that state is read, and it reruns only the work that
may now be out of date.

### If you are newer to Compose

Start with the starred questions in **Start here**. Be able to build a small
screen with hoisted state, explain `remember` and `rememberSaveable`, and render
a list with stable keys. Then move to recomposition, effects, ViewModel state,
navigation, and testing. That is enough to handle a large share of junior and
mid-level interviews.

### If you already ship Compose

Use the same questions as a quick check, but push each answer one step further.
Talk about ownership, lifecycle, failure cases, and what you would measure before
optimizing. The senior material covers stability, phase-aware state reads,
custom layout, modifier nodes, and runtime internals. Those details are useful,
but only when they help explain a real engineering decision.

### A reliable way to answer

For any Compose snippet or design question, walk through these four checks:

1. **State:** What can change, and who owns it?
2. **Read:** Which composable or phase reads that state?
3. **Identity:** What keeps state attached to the right item or call site?
4. **Lifetime:** When should the work start, restart, stop, or be restored?

For performance questions, add a fifth check: **what evidence shows there is a
problem?** Mention a release build, a system trace, a benchmark, or compiler
reports before proposing fixes.

### What interviewers usually probe

- State hoisting, `remember`, `rememberSaveable`, and observable collections
- Recomposition, the composition, layout, and drawing phases, and deferred reads
- `LaunchedEffect`, effect keys, cleanup, and stale callbacks
- Modifier order, lazy-list keys, ViewModel state collection, and navigation
- Stability, skipping, state ownership, and performance diagnosis for senior roles

The stars mark the questions worth covering on a first pass. The unstarred ones
are still useful, but they are better treated as follow-ups than as a checklist
you must memorize.

### Useful references

- [State and Jetpack Compose](https://developer.android.com/develop/ui/compose/state)
- [Lifecycle of composables](https://developer.android.com/develop/ui/compose/lifecycle)
- [Side effects in Compose](https://developer.android.com/develop/ui/compose/side-effects)
- [Compose phases and performance](https://developer.android.com/develop/ui/compose/performance/phases)
