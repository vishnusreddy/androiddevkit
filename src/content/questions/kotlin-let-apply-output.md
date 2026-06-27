---
question: "What do apply and let return?"
topic: kotlin
difficulty: junior
order: 100
starred: false
section: "Functions and idioms"
tags: ["kotlin", "output-based", "scope-functions"]
---

```kotlin
val a = StringBuilder("x").apply { append("y") }
val b = StringBuilder("x").let { it.append("y") }
val c = StringBuilder("x").let { it.append("y"); "done" }

println(a)
println(b)
println(c)
```

**Output:**

```
xy
xy
done
```

**Why:**
- **`apply`** returns the **receiver object** (the `StringBuilder`). So `a` is the builder → `"xy"`.
- **`let`** returns the **lambda result**. For `b`, the last expression is `it.append("y")`, and `StringBuilder.append` returns the same `StringBuilder` - so `b` is also the builder → `"xy"`.
- For `c`, the lambda's last expression is the string `"done"`, so `let` returns `"done"`.

**The takeaway:** `apply`/`also` always give you the object back; `let`/`run`/`with` give you **whatever the block's last line evaluates to**. Here `b` only prints `"xy"` because `append` happens to return the builder - change the last line and `let` returns that instead.
