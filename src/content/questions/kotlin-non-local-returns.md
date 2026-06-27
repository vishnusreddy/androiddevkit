---
question: "What does return do inside an inline lambda?"
topic: kotlin
difficulty: senior
tags: ["kotlin", "output-based", "lambdas", "inline"]
---

```kotlin
fun foo(): String {
    listOf(1, 2, 3).forEach {
        if (it == 2) return "early"
    }
    return "done"
}

fun bar(): String {
    listOf(1, 2, 3).forEach label@{
        if (it == 2) return@label
    }
    return "done"
}

println(foo())   // ?
println(bar())   // ?
```

**Output:**

```
early
done
```

**Why:**
- `forEach` is an **inline** function, so a bare `return` inside its lambda is a **non-local return** - it returns from the *enclosing function* `foo`. When `it == 2`, `foo` returns `"early"` immediately.
- In `bar`, `return@label` (a **labeled return**) only returns from the **lambda** - like `continue`. The loop keeps going, and `bar` falls through to `return "done"`.

a plain `return` in an inline lambda exits the surrounding function (surprising if you expected loop-`continue` behavior). Use `return@forEach` / a label to return *from the lambda only*. Non-local returns are **only** possible because `forEach` is inline - try it with a non-inline higher-order function and the bare `return` won't compile.
