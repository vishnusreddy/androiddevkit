---
title: Kotlin Language
description: Null safety, data classes, sealed types, generics, scope functions, delegation, and the language internals interviewers lean on.
category: Kotlin
order: 5
icon: "K"
---

Kotlin is the foundation everything else is built on, and it shows up in **every**
Android loop — sometimes as a warm-up, often as a trap. Interviewers use it to
tell apart people who *write* Kotlin from people who *understand* it.

### What gets tested

- **Null safety** — `?.`, `?:`, `!!`, platform types from Java, and *why* `lateinit` exists.
- **Type system** — `val`/`var`, `data`/`sealed`/`enum` classes, `Any`/`Unit`/`Nothing`, smart casts.
- **Functions & lambdas** — higher-order functions, `inline`/`noinline`/`crossinline`, `reified`, scope functions.
- **Generics** — declaration- vs use-site variance (`in`/`out`), star projection, type bounds.
- **Idioms** — delegation (`by`), `value class`, DSLs with receiver lambdas, collection operators.
- **Output-based puzzles** — boxing & the integer cache, init order, closures over loop variables, non-local returns.

### How interviewers ask

Expect a mix of **"explain the difference between X and Y"** (e.g. `lateinit` vs
`lazy`, `List` vs `Sequence`), **"what's the output of this snippet?"**, and
**"how would you model this?"** (sealed classes for UI state, `value class` for
type-safe IDs). The strongest answers always reach the *why* and the trade-off,
not just the definition.

> **Prep tip:** for every concept here, write a 5-line snippet and explain it out
> loud. If you can't teach it, you don't know it yet.
