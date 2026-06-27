---
question: "How do you handle navigation between feature modules without coupling them?"
topic: architecture
difficulty: senior
tags: ["modularization", "navigation", "decoupling"]
---

The problem: in a multi-module app, `:feature:checkout` shouldn't directly depend on `:feature:profile` - that creates **tight coupling** and **dependency cycles**. But they sometimes need to navigate to each other.

**Solutions (least to most decoupled):**

**1. Route-based navigation (Navigation component).** Features expose **routes/deep links** (strings or type-safe), and navigation goes through a shared `NavController`. A feature navigates by route without importing the destination feature's classes.
```kotlin
navController.navigate("profile/$userId")   // no compile dep on :feature:profile
```
The `:app` module assembles all feature nav graphs. Features depend on a tiny **`:core:navigation`** contract (route constants/keys), not on each other.

**2. Navigation abstraction / API modules.** Define an interface in a shared module:
```kotlin
// :core:navigation
interface ProfileNavigator { fun openProfile(id: String) }
```
The `:feature:profile` module implements it; other features inject `ProfileNavigator` and call it. Implementation is wired by DI in `:app`. This keeps features depending on **abstractions**, not each other.

**3. `api` vs `impl` module split.** A feature exposes a small **`:feature:profile:api`** (interfaces, navigation entry points) that others depend on, while **`:feature:profile:impl`** stays private. Maximum decoupling for large codebases.

**Key principles:**
- **Features depend on `core`/abstractions, never on each other** - avoids cycles and keeps build parallelism.
- **The `:app` module is the composition root** - it knows all features and wires the graph/DI.
- **Deep links** double as the inter-feature navigation contract.
- Type-safe routes (Navigation 2.8+) reduce stringly-typed errors.
