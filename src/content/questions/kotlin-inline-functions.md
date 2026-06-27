---
question: "What are inline functions, and what do noinline and crossinline do?"
topic: kotlin
difficulty: mid
tags: ["kotlin", "inline", "performance", "lambdas"]
---

`inline` tells the compiler to **copy the function body - and its lambda arguments - into the call site** instead of creating a function object for each lambda. For higher-order functions this removes the per-call lambda allocation and the extra `invoke()` call.

```kotlin
inline fun measure(block: () -> Unit) {
    val start = System.nanoTime()
    block()                       // body inlined, no Function object created
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
