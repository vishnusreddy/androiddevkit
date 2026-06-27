---
question: "What are infix functions and tailrec functions?"
topic: kotlin
difficulty: mid
tags: ["kotlin", "infix", "tailrec"]
---

**Infix functions** can be called without the dot and parentheses, reading like an operator. Requirements: marked `infix`, a member or extension, exactly **one** parameter (no default, no vararg).

```kotlin
infix fun Int.times(str: String) = str.repeat(this)
3 times "ab"        // "ababab"  (same as 3.times("ab"))
```

You already use stdlib infix functions: `to` (`"key" to 1` builds a `Pair`), `until`, `downTo`, `step`, `and`/`or`, `shl`.

**`tailrec` functions** - when a recursive function's recursive call is the very last operation (tail position), `tailrec` lets the compiler **rewrite it into a loop**, avoiding stack growth and `StackOverflowError`.

```kotlin
tailrec fun factorial(n: Long, acc: Long = 1): Long =
    if (n <= 1) acc else factorial(n - 1, acc * n)   // tail call → compiled to a loop
```

The catch: the recursive call must be the **last action** - `return 1 + factorial(...)` is *not* tail-recursive (the addition happens after), and the compiler warns. The accumulator-parameter trick (as above) is the usual way to make a function tail-recursive.
