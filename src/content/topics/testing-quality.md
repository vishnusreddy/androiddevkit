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

### What gets tested

- **Test scope**: unit, integration, instrumented, UI, and end-to-end tests.
- **Test doubles**: fakes, mocks, stubs, and when each one helps.
- **Android components**: ViewModels, repositories, Room, and Compose UI.
- **Asynchronous code**: coroutine test dispatchers, virtual time, and Flow assertions.
- **Reliability**: removing sleeps, controlling dependencies, and diagnosing flaky tests.
- **Strategy**: choosing a small set of meaningful tests instead of chasing coverage numbers.

### How interviewers ask

Expect a feature or class and a simple prompt: "How would you test this?" Start
with the behavior that matters, identify the boundaries you control, and choose
the cheapest test that can prove the behavior. Mention slower device tests only
when Android framework behavior is part of what you need to verify.

> **Prep tip:** explain one happy path, one failure path, and one edge case for a
> feature you have built. Then say which tests you would not write and why.
