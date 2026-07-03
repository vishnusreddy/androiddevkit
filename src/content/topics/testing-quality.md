---
title: Testing & Quality
description: Unit, integration, and UI tests; test doubles; reliable coroutine tests; and keeping the test suite useful as an app grows.
category: Engineering
order: 35
icon: "✓"
---

Testing questions are usually practical. Interviewers want to know what you
would test, where the test should run, and whether the result gives the team
confidence without slowing development to a crawl.

### A simple study path

Start with the starred questions: test scope, test doubles, ViewModel state,
coroutines, Room, and UI behavior. Next learn how to control the network,
WorkManager, navigation, and dependency injection. Treat screenshot,
performance, migration, and CI strategy as follow-ups for experienced roles.

### A reliable way to answer

For any "how would you test this?" prompt:

1. Name the **observable behavior**, not the implementation call you expect.
2. Pick the **smallest scope** that can prove it.
3. Replace nondeterminism such as time, threads, network, IDs, and device state.
4. Cover one success, one failure, and one boundary case.
5. Explain which slower integration or device test is still necessary.

### What gets tested

- **Test scope**: unit, integration, instrumented, UI, and end-to-end tests.
- **Test doubles**: fakes, mocks, stubs, and when each one helps.
- **Android components**: ViewModels, repositories, Room, and Compose UI.
- **Asynchronous code**: coroutine test dispatchers, virtual time, and Flow assertions.
- **Boundaries**: HTTP contracts, database migrations, WorkManager, navigation, and DI replacement.
- **Reliability**: removing sleeps, controlling dependencies, and diagnosing flaky tests.
- **Quality signals**: accessibility, visual regression, performance, CI feedback, and useful coverage.

### How interviewers ask

Expect a feature or class and a simple prompt: "How would you test this?" Do not
answer with a list of frameworks. Start with risk and behavior, then choose the
scope and tools. Good candidates also identify what a unit test cannot prove.

> **Prep tip:** explain one happy path, one failure path, and one edge case for a
> feature you built. Then say which tests you would not write and why.

### Useful references

- [Android testing strategies](https://developer.android.com/training/testing/fundamentals/strategies)
- [Testing coroutines](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/)
- [Compose testing](https://developer.android.com/develop/ui/compose/testing)
- [Testing Room](https://developer.android.com/training/data-storage/room/testing-db)
