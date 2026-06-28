---
title: Code snippet output questions
description: Practice reading Kotlin precisely, predicting deterministic output, and explaining the rule behind it.
category: Kotlin
order: 8
icon: "{}"
---

Output questions are less about clever tricks than they first appear. A good
interviewer is checking whether you can slow down, track values, and distinguish
what Kotlin guarantees from what merely happened on one run.

### A method that works under pressure

1. **Check that it compiles.** Watch types, nullability, labels, and overloads.
2. **Mark evaluation order.** Kotlin evaluates function arguments and receiver
   expressions in the order they appear.
3. **Track state on paper.** Write down mutable variables, shared references,
   and each side effect such as `println` or `add`.
4. **Expand the convenient syntax.** Ask what `?.`, `?:`, `let`, `copy`, or a
   sequence pipeline actually does.
5. **Separate dispatch rules.** Members use virtual dispatch. Extensions are
   selected from the compile-time receiver type.
6. **Call out uncertainty.** If threads or coroutines can interleave, give the
   guaranteed ordering only. Do not invent one exact output.

In an interview, give the output first. Then explain the two or three lines that
decide it. If the snippet contains a bad production pattern, say so after you
answer the question. That keeps the explanation focused without missing the
engineering lesson.

The starred questions cover the patterns worth learning first: lazy sequences,
shallow copies, extension dispatch, default arguments, null-safe evaluation,
and expression-based control flow.

All snippets in this topic are intended to be deterministic on Kotlin/JVM. Time
and thread scheduling are deliberately kept out unless the question explicitly
states what is guaranteed.

### Useful references

- [Kotlin language documentation](https://kotlinlang.org/docs/home.html)
- [Kotlin language specification](https://kotlinlang.org/spec/kotlin-spec.html)
