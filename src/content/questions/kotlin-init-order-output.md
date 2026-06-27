---
question: "What's the output? Property and init block initialization order."
topic: kotlin
difficulty: senior
tags: ["kotlin", "output-based", "initialization"]
---

```kotlin
class Sample {
    val a = "a".also { println("prop a") }
    init { println("init 1") }
    val b = "b".also { println("prop b") }
    init { println("init 2") }
}

fun main() { Sample() }
```

**Output:**

```
prop a
init 1
prop b
init 2
```

**Why:** property initializers and `init` blocks run **in the order they're written**, top to bottom, interleaved — not "all properties, then all inits." The constructor effectively executes them as a single sequence.

**The classic trap** is referencing a property declared *below*:
```kotlin
class Broken {
    init { println(x.length) }  // x not initialized yet → NullPointerException
    val x = "hi"
}
```
Even though `x` is a non-null `val`, at the time the `init` block runs it still holds its default (`null`), so this throws. The compiler warns you ("accessing non-initialized property").

**Lesson:** declaration order is execution order. Don't reference a property before its initializer has run.
