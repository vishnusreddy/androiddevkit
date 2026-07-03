---
question: "What does return do inside an inline lambda?"
topic: kotlin
difficulty: senior
order: 20
starred: false
section: "Advanced language features"
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

A plain `return` in an inline lambda exits the surrounding function (surprising
if you expected loop-`continue` behavior). Use `return@forEach` or an explicit
label to return *from the lambda only*. Non-local returns are possible here
because `forEach` is inline; a bare return from a non-inline lambda does not
compile.
