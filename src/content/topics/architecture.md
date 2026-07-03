---
title: Architecture & Patterns
description: MVVM/MVI, Clean Architecture, repositories, dependency injection, modularization, design patterns, and structuring an app that scales and is testable.
category: Engineering
order: 30
icon: "◳"
---

Architecture rounds test whether you can make a codebase **easy to change, test,
and operate as the product and team grow**. The names of patterns matter less
than ownership, data flow, boundaries, and the trade-offs behind each decision.
Expect open-ended prompts, code-review discussions, and follow-up questions that
remove one of your original assumptions.

### A simple study path

Start with the starred questions. Learn the recommended UI and data layers,
repositories, unidirectional data flow, and dependency injection. Then practise
explaining one feature from user action to storage and back to rendered state.
Add Clean Architecture, offline-first data, modularization, and detailed DI
scopes only after that basic flow is clear.

### A reliable way to answer

For any architecture prompt, cover five things in order:

1. **Responsibilities:** What owns UI state, business rules, and data policy?
2. **Data flow:** Where do events enter, where is state produced, and what is the
   single source of truth?
3. **Boundaries:** Which details are hidden behind an interface or module?
4. **Failure and lifetime:** What happens on process death, offline, cancellation,
   or partial failure?
5. **Proof:** How will you test, measure, and evolve the design?

### What gets tested

- **Presentation patterns** - MVC → MVP → MVVM → MVI, and *why* the field evolved; unidirectional data flow.
- **Clean Architecture** - layers, dependency direction, use cases, and when separate models or interfaces earn their cost.
- **Data layer** - repository pattern, single source of truth, offline-first (NetworkBoundResource), caching, Paging 3.
- **Dependency injection** - DI vs service locator, Hilt/Dagger vs Koin, components & scoping, assisted injection, dispatcher injection.
- **Design patterns** - Observer, Factory, Builder, Singleton, Strategy, Adapter/Decorator, Facade - with real Android examples.
- **Modularization** - by feature vs layer, `api`/`impl` splits, inter-feature navigation, build-speed and encapsulation wins.
- **State & events** - modeling immutable `UiState`, one-off events, `SavedStateHandle`, error handling across layers.
- **Engineering judgment** - SOLID, coupling and cohesion, feature flags, error boundaries, and recognizing over-engineering.

### How interviewers ask

Common prompts include **"walk me through this feature"**, **"review this
ViewModel"**, and comparisons such as MVVM vs MVI or Hilt vs Koin. Strong answers
state assumptions, draw the dependency and data-flow directions, and explain
when a simpler design is enough. A pattern without a problem is just ceremony.

> **Prep tip:** design one feature end to end out loud, including layers, data
> flow, DI, failures, and tests. Finish with what you deliberately did not add.
