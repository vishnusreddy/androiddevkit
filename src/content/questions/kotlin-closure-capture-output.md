---
question: "What's the output? Lambdas capturing a loop variable."
topic: kotlin
difficulty: mid
tags: ["kotlin", "output-based", "closures", "lambdas"]
---

```kotlin
val actions = mutableListOf<() -> Int>()
for (i in 1..3) {
    actions.add { i }
}
println(actions.map { it() })
```

**Output:**

```
[1, 2, 3]
```

**Why this surprises people:** in Java, a similar loop with a mutable index would capture the *same* variable, and all lambdas would print the final value. Kotlin is different — in a `for` loop, **each iteration has its own `i`**. The lambda closes over that iteration's value, so you get `[1, 2, 3]`.

**The contrast** — capture a single mutable variable and they *do* share it:
```kotlin
var j = 0
val fns = mutableListOf<() -> Int>()
while (j < 3) { fns.add { j }; j++ }
println(fns.map { it() })   // [3, 3, 3] — all see the final j
```

**Key point:** Kotlin closures capture the **variable**, not a snapshot of its value. The loop case works out because `for` introduces a fresh `val` each iteration; the `while` case shares one mutable `var`, so every lambda sees its final value.
