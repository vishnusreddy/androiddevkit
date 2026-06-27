---
question: "How does operator overloading work in Kotlin?"
topic: kotlin
difficulty: mid
tags: ["kotlin", "operators"]
---

You overload an operator by defining a function with a reserved name and the `operator` modifier. Kotlin maps symbols to these functions:

| Operator | Function |
|---|---|
| `a + b` | `a.plus(b)` |
| `a[i]` | `a.get(i)` |
| `a[i] = v` | `a.set(i, v)` |
| `a in b` | `b.contains(a)` |
| `a..b` | `a.rangeTo(b)` |
| `a == b` | `a.equals(b)` |
| `+a` / `-a` | `unaryPlus` / `unaryMinus` |
| `a()` | `a.invoke()` |

```kotlin
data class Vec(val x: Int, val y: Int) {
    operator fun plus(o: Vec) = Vec(x + o.x, y + o.y)
    operator fun get(i: Int) = if (i == 0) x else y
}

val v = Vec(1, 2) + Vec(3, 4)   // Vec(4, 6)
val first = v[0]                 // 4
```

**Things interviewers check you know:**
- The operator function name and signature are **fixed** - you can't invent new symbols.
- `==` always routes through `equals` (with a null check), and `===` (referential) **can't** be overloaded.
- Overloading `invoke` is how `MutableState`-like or DSL objects become "callable."

**Use it sparingly** - only when the operator's meaning is obvious (vectors, money, durations). `kotlin.time.Duration` (`1.hours + 30.minutes`) is a good example of tasteful use.
