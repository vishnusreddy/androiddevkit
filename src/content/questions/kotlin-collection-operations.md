---
question: "Walk through the key collection operators: map, filter, fold/reduce, groupBy, associate, partition, flatMap."
topic: kotlin
difficulty: mid
tags: ["kotlin", "collections", "functional"]
---

These are bread-and-butter and come up constantly:

```kotlin
val nums = listOf(1, 2, 3, 4, 5)

nums.map { it * 2 }              // [2,4,6,8,10] — transform each
nums.filter { it % 2 == 0 }     // [2,4]        — keep matching
nums.reduce { acc, n -> acc + n } // 15         — combine, seed = first element
nums.fold(100) { acc, n -> acc + n } // 115     — combine with explicit seed

val words = listOf("apple", "avocado", "banana")
words.groupBy { it.first() }    // {a=[apple, avocado], b=[banana]}
words.associate { it to it.length } // {apple=5, avocado=7, banana=6}
words.associateBy { it.first() } // {a=avocado, b=banana} (last wins per key)
words.partition { it.length > 5 } // Pair([avocado, banana], [apple])

listOf(listOf(1,2), listOf(3)).flatMap { it } // [1,2,3] — map then flatten
```

Distinctions interviewers probe:
- **`fold` vs `reduce`** — `reduce` starts from the first element and throws on an empty list; `fold` takes an explicit initial accumulator (and can change the result type).
- **`associate` vs `associateBy` vs `groupBy`** — `associate` builds key→value pairs you specify; `associateBy` keys by a selector (one value per key, **last wins**); `groupBy` keys to a **list** of all matching values.
- **`map` vs `flatMap`** — `flatMap` is for when each element produces a *collection* you want flattened into one.
- **`mapNotNull` / `filterNotNull`** — transform-and-drop-nulls in one pass.

For big chains, prepend `.asSequence()` to avoid intermediate lists.
