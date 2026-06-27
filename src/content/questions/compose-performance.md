---
question: "How do you diagnose and fix Compose performance problems?"
topic: jetpack-compose
difficulty: mid
tags: ["compose", "performance", "recomposition"]
---

Approach it as **measure → find the cause → fix**, not guesswork.

**Measure first:**
- **Layout Inspector** shows **recomposition counts** per composable - find what recomposes too often.
- **Compose compiler metrics** report which composables are **skippable/restartable** and which **parameters are unstable**.
- **System Trace / `Macrobenchmark`** for jank and frame timing.
- Always profile a **release build** - debug Compose is much slower and misleading.

**Common causes & fixes:**

1. **Unstable parameters** → composable can't skip. Fix with `ImmutableList`, `@Immutable`/`@Stable`, or stable state classes.
2. **Reading state too high / too early** → wide recomposition scope. Read state as **low** in the tree and as **late** in the phases as possible. Defer reads to lambda modifiers: `Modifier.offset { }`, `graphicsLayer { }`, `drawBehind { }` - these read during layout/draw, skipping composition.
3. **New lambda/object allocations each recomposition** → break skipping. `remember` expensive objects; method references and stable lambdas help (strong skipping remembers lambdas).
4. **Rapidly-changing state read directly** (scroll offset) → wrap with `derivedStateOf` so readers update only on meaningful changes.
5. **Work in composition** → no heavy computation, sorting, or I/O in a composable body; `remember(key) { }` it or move it to the ViewModel.
6. **Missing keys in lazy lists** → wasted recomposition on reorder; add `key = { it.id }`.

**Ship-time wins:**
- **Baseline Profiles** - precompile hot paths (including Compose) so the first runs are AOT-compiled, cutting startup and scroll jank significantly.
- **Strong skipping mode** (Kotlin 2.x) reduces manual stability work.
