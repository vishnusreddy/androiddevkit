---
company: "Sample Product Co."
role: "Senior Android Engineer"
level: "Senior"
location: "Bengaluru, India"
remote: false
outcome: "Offer"
date: 2026-05-20
author: "Anonymous"
tags: ["coroutines", "compose", "system-design", "5-rounds"]
---

> This is a sample experience to show the format. Replace it with your own -
> see [how to contribute](/contribute/).

## Overview

Five rounds over two weeks for a Senior Android role at a mid-size product
company. The bar was clearly "can you own a feature end to end," not trivia.

## Round 1 - Recruiter / phone screen (30 min)
Background, current stack, why I was switching. One light technical question:
"What's the difference between `StateFlow` and `LiveData`?" Conversational, not
a filter on depth.

## Round 2 - Coding (60 min)
A real-world task rather than LeetCode: parse a paginated API response and expose
it as a `Flow`, handling errors and retries. They cared about cancellation,
testability, and how I structured the repository - not clever algorithms.

## Round 3 - Android deep-dive (60 min)
Lifecycle and Compose questions that built on each other: recomposition, state
hoisting, why a `LazyColumn` was janking, and how I'd debug it. Then a debugging
exercise on a memory leak from a leaked coroutine scope.

## Round 4 - Mobile system design (60 min)
"Design an offline-first notes app with sync." We spent most of the time on
conflict resolution and making Room the source of truth. They pushed on
trade-offs repeatedly - there was no single right answer, they wanted reasoning.

## Round 5 - Behavioural / hiring manager (45 min)
Ownership stories, a disagreement with a teammate, and how I mentor juniors.
Standard, but they probed for specifics ("what exactly did *you* do?").

## Takeaways
- Know your concurrency cold - it came up in three of five rounds.
- For system design, **say the trade-off out loud**. They reward naming the tension.
- Have two or three crisp ownership stories ready with concrete impact.
