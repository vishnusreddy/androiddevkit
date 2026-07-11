---
title: Modularization, ownership, and architectural boundaries
description: Define Android modules from ownership and change patterns, then enforce dependency direction without creating ceremonial abstraction.
level: senior
order: 1
duration: 55 min
quizHref: /practice/?test=architecture-test
quizLabel: Take the architecture quiz
---

Modularization is a means of controlling coupling, not an architectural achievement by itself. A Gradle module adds configuration, dependency management, navigation decisions, and cognitive overhead. It earns that cost when it removes a specific problem: teams collide in the same feature, changes invalidate too much of the build, an implementation leaks through many callers, or ownership is unclear.

A senior design begins with change and ownership rather than package names. The proposed boundary should state what may depend on it, what it deliberately hides, which team owns it, and which measurable problem it improves. A module count is not evidence of a healthy architecture.

## Learning goals

- Find module boundaries from change frequency and ownership rather than package names alone.
- Keep dependency direction healthy: features depend on stable APIs, not on each other's internals.
- Choose among a monolith, package-by-feature, and multiple modules from the current problem.
- Migrate incrementally with measurable checkpoints.
- Discuss modularization as a tradeoff rather than a universal rule.

## Find a boundary from change and ownership

Start by mapping:

1. What changes **together**?
2. Who **owns** it?
3. What must remain **stable** for others?
4. What is **expensive to recompile** today?

Example: a checkout feature might own its UI, presentation state, and internal data coordination. The rest of the app should depend on a small **entry point**, not on checkout’s database classes or private composables.

![Feature and core module dependency structure](/diagrams/modularization.svg)

### API vs implementation modules

A common pattern:

- `:feature:checkout:api` - public navigation entry, public models needed by others, interfaces.
- `:feature:checkout:impl` - screens, ViewModels, internal repositories - depended on only by `:app` or a feature aggregator.

```kotlin
// :feature:checkout:api
interface CheckoutEntryPoint {
    fun intent(context: Context, cartId: String): Intent
    // or NavGraph registration hooks / DI entry points
}

// other features depend only on the api module
```

This prevents `FeedFragment` from importing `CheckoutDao`.

## Dependency direction matters more than module count

Healthy rules of thumb:

- **Features do not depend on other features’ impl modules.**
- **Core libraries do not depend on features.**
- **App module wires graph** (or a thin wiring module does).
- Prefer depending on **interfaces** for cross-feature collaboration.

When two features need shared behavior, extract a **core** or **domain** module with a stable API - do not let them reach into each other “just this once.”

![Direct feature coupling compared with a shared API boundary](/diagrams/dependency-boundary-comparison.svg)

## What to put in core modules

| Module | Contents | Caution |
|--------|----------|---------|
| `:core:model` | Shared pure models | Avoid dumping everything |
| `:core:network` | Retrofit, interceptors | Keep feature DTOs local when possible |
| `:core:database` | Room setup | Feature-specific entities can live in feature modules |
| `:core:designsystem` | Theme, components | Prevent feature-specific widgets from polluting it |
| `:core:common` | Result types, coroutines helpers | “common” becomes a junk drawer quickly - police it |

**Junk drawer modules** recreate the monolith with worse navigation.

## Build speed and configuration

Multi-module can improve:

- Parallel compilation
- Incremental compilation scope
- Clearer ABI / public API surfaces (with Kotlin explicit API mode)

It can also worsen:

- Configuration time (too many modules)
- Redundant dependency declaration
- Composite build complexity

Senior move: measure before/after with **Gradle build scans** on representative changes (“edit one file in checkout - what recompiles?”).

## Navigation across modules

Options:

1. **Central NavHost in :app** with feature-provided destinations registered at wiring time.
2. **Deep links** as the cross-feature API.
3. **Navigator interfaces** in api modules implemented by app/wiring.

```kotlin
interface AppNavigator {
    fun openCheckout(cartId: String)
    fun openArticle(articleId: String)
}
```

Avoid circular navigation dependencies between feature impls.

## DI across modules

Hilt:

- `@InstallIn` modules live next to the code they bind.
- Feature impl modules contribute bindings; app aggregates.
- Use entry points carefully; prefer constructor injection.

Manual DI / kotlin-inject / Metro / Anvil - same principle: **wiring at the edges**, not static service locators inside features.

## When *not* to modularize

- Solo developer, small app, no compile pain, no ownership boundaries.
- “We might hire more people someday” without current coordination cost.
- Splitting by technical layer only (`:ui`, `:domain`, `:data`) when features still change as a ball of mud - layer modules can encode the wrong axis of change.

Package-by-feature inside a single module is often the right intermediate step.

## Migrate in small, measurable steps

1. **Package by feature** inside the monolith; ban cross-feature deep imports via convention / ArchUnit / Konsist.
2. Extract **core** libraries that are already stable.
3. Extract one **leaf feature** with low fan-in.
4. Introduce **api/impl** when another feature needs a stable contract.
5. Automate dependency rules (Gradle dependency-analysis, module graph checks).

Each step should answer: *what became safer or faster?*

## Interview framing

A strong senior answer sounds like:

> We modularize along ownership and change boundaries. Features expose a narrow API module; implementations stay private. Core holds shared infrastructure without becoming a dumping ground. We measure compile impact and migrate incrementally from a package-by-feature monolith rather than a big-bang rewrite.

Weak answers only say “Clean Architecture says five modules” or “Google’s Now in Android has many modules so we should too.”

## Common pitfalls

1. Circular dependencies “solved” with reflection or soft references.
2. `:core:common` absorbing feature logic.
3. Exposing Room entities as public API.
4. 80 modules for a 3-person team - configuration tax.
5. Modularizing UI without modularizing **data ownership**, so features still fight over the same tables without contracts.

## Practice checklist

1. Draw your current app’s module (or package) graph; mark illegal edges.
2. Propose an api/impl split for one feature and list the public types only.
3. Identify one shared junk type that should move or die.
4. Write a dependency rule you could enforce in CI.

## What you should be able to explain

- Boundary discovery from ownership and change.
- Dependency direction and api/impl.
- Build cost trade-offs with measurement.
- Incremental migration path.
- When a modular monolith is enough.

Next: **Offline sync and mobile system design** - designing features that live on unreliable networks with clear product truth.
