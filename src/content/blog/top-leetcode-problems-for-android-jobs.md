---
title: "Coding interview practice for Android developers"
description: "A focused way to prepare for coding rounds in Kotlin without assuming every Android company asks the same LeetCode questions."
date: 2026-06-25
author: "AndroidDevKit"
tags: ["interviews", "leetcode"]
heroImage: "/blog/android-coding-interviews.jpg"
heroAlt: "A developer practising array, hash map, pointer, stack, and tree patterns before applying them to an Android app"
---

There is no universal list of LeetCode questions for Android jobs. Some teams ask
you to build or debug a small screen. Some use a general data-structures round.
Large companies may use the same coding assessment for mobile and backend
candidates.

So the first step is not opening a list of 200 problems. Ask the recruiter what
the round looks like: language, duration, editor, expected difficulty, and whether
Android APIs are involved. If they will not say, prepare a sensible core and keep
the rest of your time for Kotlin, the Android framework, and architecture.

## Use an interview process, not a memorised answer

<div class="article-flow" role="img" aria-label="Coding interview process from clarifying the problem to testing the final solution">
  <div class="flow-step"><span>1</span><strong>Clarify</strong><small>Inputs, output, constraints</small></div>
  <span class="flow-arrow">→</span>
  <div class="flow-step"><span>2</span><strong>Work examples</strong><small>Normal and edge cases</small></div>
  <span class="flow-arrow">→</span>
  <div class="flow-step"><span>3</span><strong>State a simple solution</strong><small>Correct before clever</small></div>
  <span class="flow-arrow">→</span>
  <div class="flow-step"><span>4</span><strong>Improve it</strong><small>Time and space trade-offs</small></div>
  <span class="flow-arrow">→</span>
  <div class="flow-step"><span>5</span><strong>Code and test</strong><small>Trace your own examples</small></div>
</div>

Candidates often lose time by silently hunting for the optimal trick. Say what
you know. A correct linear scan that you can improve is a better starting point
than five minutes of unexplained silence.

## A compact practice set

This is a study set, not a prediction. Each problem earns its place because it
teaches a reusable pattern.

### Arrays and hash maps

- **Two Sum:** replacing a nested search with remembered values.
- **Contains Duplicate:** choosing a set when membership is the real question.
- **Group Anagrams:** creating a stable key for equivalent values.
- **Product of Array Except Self:** combining prefix and suffix information.

### Two pointers and sliding windows

- **Valid Palindrome:** moving inward while ignoring irrelevant characters.
- **Best Time to Buy and Sell Stock:** tracking the best earlier state.
- **Longest Substring Without Repeating Characters:** maintaining a valid window.

### Stacks and intervals

- **Valid Parentheses:** matching nested structure with a stack.
- **Merge Intervals:** sorting first to make a difficult comparison local.
- **Daily Temperatures:** using a monotonic stack to avoid repeated scanning.

### Linked structures, trees, and graphs

- **Reverse Linked List:** changing pointers without losing the remaining list.
- **Maximum Depth of Binary Tree:** writing a small recursive traversal.
- **Binary Tree Level Order Traversal:** breadth-first search with a queue.
- **Number of Islands:** marking visited nodes in a grid.

If your target company is known for harder generalist rounds, extend into heaps,
backtracking, dynamic programming, and more graph work. If the interview is a
practical Android exercise, spend that time building clean state and handling
failure instead.

## Kotlin details worth practising

Using Kotlin in the interview is a good idea only if the standard library feels
natural. Practise these before the clock starts:

- `mutableMapOf`, `getOrPut`, sets, `ArrayDeque`, and priority queues.
- Sorting with `sortedBy`, `sortWith`, and `compareBy`.
- Iterating indices safely with `indices`, `withIndex`, and `until`.
- Handling nullable map lookups without sprinkling `!!` everywhere.
- Choosing `Int` or `Long` when sums can overflow.
- Writing a small data class or helper function without overengineering it.

Convenient collection operations are welcome when they keep the solution clear.
They are less helpful when several chained allocations hide the actual complexity.
Be able to write the straightforward loop too.

## A three-week plan that stays in proportion

| Week | Focus | Goal |
| --- | --- | --- |
| 1 | Arrays, maps, strings, two pointers | Recognise the pattern and explain a simple solution |
| 2 | Sliding windows, stacks, linked lists, trees | Solve easy problems and a few medium ones in Kotlin |
| 3 | Mixed timed practice and mock interviews | Communicate, code, and test within the interview format |

After solving a problem, return two or three days later and do it without notes.
If the approach has vanished, you recognised the answer but did not learn the
pattern.

Track mistakes rather than just solved counts. Useful categories include:

- Misread the constraints.
- Chose the wrong data structure.
- Knew the approach but could not express it in Kotlin.
- Missed an empty, duplicate, or overflow case.
- Could not explain the complexity.

That list tells you what to practise next. A profile showing 300 solved problems
does not.

## Keep Android preparation in the schedule

Coding practice should support the process you are actually interviewing for.
Continue reviewing [Kotlin](/topics/kotlin/), [Coroutines](/topics/coroutines/),
and the [broader interview plan](/blog/how-to-prepare-for-android-interviews/).
The right balance depends on the company, which is another reason to ask about the
format before you start grinding.

