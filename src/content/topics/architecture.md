---
title: Architecture & Patterns
description: MVVM/MVI, Clean Architecture, repositories, dependency injection, modularization, design patterns, and structuring an app that scales and is testable.
category: Engineering
order: 30
icon: "◳"
---

Mid and senior loops lean heavily on architecture — it's where interviewers see
whether you can build something that **scales, tests, and survives change**, not
just make one screen work. Expect open-ended "how would you structure…?"
discussions where there's no single right answer, only well-argued trade-offs.

### What gets tested

- **Presentation patterns** — MVC → MVP → MVVM → MVI, and *why* the field evolved; unidirectional data flow.
- **Clean Architecture** — layers (UI/domain/data), the dependency rule, use cases, per-layer models & mapping.
- **Data layer** — repository pattern, single source of truth, offline-first (NetworkBoundResource), caching, Paging 3.
- **Dependency injection** — DI vs service locator, Hilt/Dagger vs Koin, components & scoping, assisted injection, dispatcher injection.
- **Design patterns** — Observer, Factory, Builder, Singleton, Strategy, Adapter/Decorator, Facade — with real Android examples.
- **Modularization** — by feature vs layer, `api`/`impl` splits, inter-feature navigation, build-speed and encapsulation wins.
- **State & events** — modeling immutable `UiState`, one-off events, `SavedStateHandle`, error handling across layers.
- **Quality** — SOLID, coupling/cohesion, the test pyramid, fakes vs mocks, ViewModel testing, anti-patterns.

### How interviewers ask

Lots of **"walk me through how you'd structure this feature"**, **comparison
questions** (MVVM vs MVI, Hilt vs Koin, fakes vs mocks), and **"what's wrong with
this design?"** They reward two things at once: knowing the patterns, *and*
**judgment** about when not to apply them — naming the trade-off ("I'd skip the
domain layer here because…") is what separates senior answers.

> **Prep tip:** be ready to design a feature end-to-end out loud — layers, data
> flow, DI, testing — and to defend *why*. Always state the trade-off; "it
> depends, and here's on what" is the senior signal.
