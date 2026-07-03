---
question: "What are inline functions, and what do noinline and crossinline do?"
topic: kotlin
difficulty: mid
order: 160
starred: true
section: "Functions and idioms"
tags: ["kotlin", "inline", "performance", "lambdas"]
---

`inline` asks the compiler to **copy the function body—and inlinable lambda
arguments—into the call site**. For a small higher-order function this can
remove a virtual `invoke()` call and avoid allocating a capturing lambda object;
the compiler may already reuse some non-capturing lambdas.

```kotlin
inline fun measure(block: () -> Unit) {
    val start = System.nanoTime()
    block()                       // body and inlinable call are expanded here
    Log.d("perf", "${System.nanoTime() - start}ns")
}
```

Two extra benefits unlocked by inlining:
- **Non-local returns** - a `return` inside the lambda can return from the *enclosing* function.
- **`reified` type parameters** - the real type is available at runtime (covered separately).

**The modifiers:**
- **`noinline`** - opt a specific lambda *out* of inlining (e.g. you need to store it in a variable or pass it on as an object).
- **`crossinline`** - keep the lambda inlined but **forbid non-local returns**, needed when the lambda is called from another execution context (like inside a `Runnable`/another lambda).

```kotlin
inline fun run(crossinline body: () -> Unit) {
    val r = Runnable { body() }   // crossinline required here
    r.run()
}
```

**When NOT to inline:** large function bodies (inlining bloats bytecode at every call site) or functions with no lambda parameters (little benefit). Use it for small higher-order utilities.
