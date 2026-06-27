---
title: Coroutines & Flow
description: Structured concurrency, scopes, dispatchers, cancellation, exception handling, and reactive streams with Flow, StateFlow, and Channels.
category: Kotlin
order: 10
icon: "⟳"
---

Coroutines are the **single most-asked Android topic** - if you prepare nothing
else deeply, prepare this. Modern Android is coroutine-first, so interviewers use
it to gauge whether you understand asynchrony or just copy patterns.

### A simple study path

Learn `launch`, `async`, dispatchers, scopes, and cancellation first. Add basic
Flow collection and `StateFlow` next. Exception propagation, Channels, custom
Flow builders, and operator internals are follow-up material rather than a
starting point.

### What gets tested

- **Fundamentals** - what `suspend` really does (CPS / state machine), coroutines vs threads, builders (`launch`, `async`, `withContext`, `runBlocking`).
- **Structured concurrency** - scopes, `Job` vs `SupervisorJob`, parent/child cancellation, `coroutineScope` vs `supervisorScope`.
- **Dispatchers & context** - `Main`/`IO`/`Default`, `CoroutineContext` elements, `withContext`, `limitedParallelism`.
- **Cancellation** - cooperative cancellation, `isActive`/`ensureActive`, `CancellationException`, timeouts.
- **Exception handling** - where `launch` vs `async` exceptions surface, `CoroutineExceptionHandler`, supervision.
- **Flow** - cold vs hot, operators (`map`, `flatMapLatest`, `combine`, `debounce`), `flowOn`, backpressure, `catch`/`retry`.
- **StateFlow / SharedFlow / Channels** - modeling UI state vs one-off events, `stateIn`/`shareIn`, `WhileSubscribed`.
- **Android integration** - `viewModelScope`, `lifecycleScope`, `repeatOnLifecycle`, `collectAsStateWithLifecycle`.
- **Testing** - `runTest`, test dispatchers, Turbine.

### How interviewers ask

A heavy dose of **"what's the output / in what order?"** (concurrency with
`delay`, `collectLatest`, async exceptions), **comparison questions**
(`StateFlow` vs `SharedFlow`, `combine` vs `zip`), and **practical design**
("build search-as-you-type", "expose state from a ViewModel"). They're listening
for whether you understand *why* - e.g. the race condition `flatMapLatest` solves,
or why `Thread.sleep` in a coroutine is a bug.

> **Prep tip:** be able to reason about *which thread runs what* and *when a
> coroutine is cancelled* for any snippet. Those two questions underlie most
> coroutine interview problems.
