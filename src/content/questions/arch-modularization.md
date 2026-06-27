---
question: "Why modularize an Android app, and how do you structure modules?"
topic: architecture
difficulty: senior
tags: ["modularization", "gradle", "scalability"]
---

Splitting a single `:app` module into many Gradle modules pays off as a codebase/team grows.

**Benefits:**
- **Build speed** — Gradle builds modules in **parallel** and only **recompiles changed** modules (incremental builds). A one-line change doesn't rebuild the world.
- **Separation & encapsulation** — a module exposes a small **`api`** surface and hides internals (`internal` + `implementation` deps), enforcing boundaries the compiler checks.
- **Team scalability** — teams own modules with fewer merge conflicts.
- **Reusability** — share modules across apps (e.g. a design-system module).
- **Dynamic delivery** — feature modules can be downloaded on demand.

**Common structures:**
- **By layer** (`:data`, `:domain`, `:ui`) — simple, but every feature touches every module → poor parallelism and ownership at scale.
- **By feature** (`:feature:feed`, `:feature:profile`) — preferred for larger apps; each feature is independent and can itself be layered internally.
- **Hybrid (recommended)** — feature modules + shared **`:core`** modules (`:core:network`, `:core:database`, `:core:designsystem`, `:core:common`). This is the **Now in Android** sample's approach.

```
:app                      (wires features together, DI setup)
:feature:feed   :feature:profile   :feature:settings
:core:data   :core:domain   :core:network   :core:database   :core:designsystem
```

**Key design rules interviewers want:**
- **`api` vs `implementation`** — use `implementation` to keep a dependency **off** the consuming module's compile classpath (faster builds, real encapsulation); use `api` only when a type leaks into your public API.
- **Avoid cyclic dependencies** — features shouldn't depend on each other directly; route through a **navigation/abstraction** module or `:core`.
- **Feature modules depend on core, not vice versa** (dependency rule).
- **Convention plugins** (`build-logic`) to share Gradle config and avoid copy-paste.

**Trade-offs:** more boilerplate (Gradle files), a steeper setup, and cross-module navigation/DI wiring complexity. Worth it for medium/large apps; overkill for a tiny one.

**Soundbite:** "Modularize for build speed, encapsulation, and team scaling. Prefer feature modules + shared `:core` modules, use `implementation` over `api` for encapsulation, keep dependencies pointing toward core, and avoid cycles. Now in Android is the reference structure."
