---
title: "How to prepare for an Android interview (a 4-week plan)"
description: "A focused, week-by-week plan to go from rusty to ready for an Android engineering interview without burning out."
date: 2026-06-01
author: "AndroidDevKit"
tags: ["preparation", "strategy"]
---

Most Android interview prep fails for one reason: it's unfocused. You bookmark
forty articles, grind random LeetCode, and still walk in unsure. Here's a tighter
plan that maps to what Android interviews actually test.

## Week 1 - Language & concurrency

This is where the most points are won and lost. Spend the week on:

- **Kotlin fundamentals**: null safety, data/sealed classes, scope functions, generics.
- **Coroutines & Flow**: structured concurrency, `launch` vs `async`, dispatchers, cancellation, `StateFlow` vs `SharedFlow`.

Don't just read - write small snippets and explain them out loud. If you can't
teach it, you don't know it yet. Drill the [Coroutines topic](/topics/coroutines/).

## Week 2 - Android framework & Compose

- Lifecycles, configuration changes, process death, and **why** the ViewModel exists.
- Jetpack Compose: recomposition, state hoisting, side-effect APIs, and performance.

Build one tiny app from scratch this week. Nothing teaches the framework like
fighting it.

## Week 3 - Architecture & system design

- MVVM vs MVI, unidirectional data flow, repository pattern, DI with Hilt.
- Practice two or three **mobile system design** prompts out loud: an image feed,
  a chat app, an offline-first client. Always name the trade-offs.

## Week 4 - Mock interviews and stories

- Do **timed mock interviews**, ideally with another engineer.
- Prepare three behavioural stories with concrete impact ("I cut cold start by 30%").
- Review the [interview experiences](/experiences/) for companies on your list.

## A few principles

> Depth beats breadth. Interviewers can tell the difference between "I read about
> this" and "I've shipped this."

- **Explain the *why*.** Every answer should reach the trade-off, not stop at the definition.
- **Measure, don't memorize.** Mention the tools (Layout Inspector, profiler, recomposition counts) - it signals seniority.
- **Rest before the interview.** A tired brain fumbles questions you actually know.

Good luck - and when you're through it, [pay it forward](/contribute/) by sharing
your own experience.
