---
question: "Explain the scope functions: let, run, with, apply, also. How do you choose?"
topic: kotlin
difficulty: mid
tags: ["kotlin", "scope-functions", "stdlib"]
---

They all execute a block on an object; they differ in **how you reference the object** (`it` vs `this`) and **what they return** (the object vs the lambda result).

| Function | Receiver | Returns | Typical use |
|---|---|---|---|
| `let`   | `it`   | lambda result | null-checks, transform a value |
| `run`   | `this` | lambda result | run a block + return a result |
| `with`  | `this` | lambda result | group calls on one object (not an extension) |
| `apply` | `this` | the object | configure/build an object |
| `also`  | `it`   | the object | side effects (logging, validation) |

```kotlin
// let — operate on a nullable, transform
val len = name?.let { it.trim().length } ?: 0

// apply — configure and return the same object
val paint = Paint().apply {
    color = Color.RED
    isAntiAlias = true
}

// also — side effect, pass through
val user = repo.load().also { Log.d("TAG", "loaded $it") }
```

**How to choose (the mental model interviewers like):**
- Need the **result** of the block? → `let` / `run` / `with`.
- Need the **object back** (chaining/config)? → `apply` / `also`.
- Referencing **members a lot**? → `this`-receivers (`run`/`with`/`apply`) read cleaner.
- Want an explicit name for clarity? → `it`-receivers (`let`/`also`).

`apply` for building, `also` for side effects, `let` for null-safe transforms are the three you'll reach for most.
