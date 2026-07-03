---
question: "In what order are Kotlin properties and init blocks initialized?"
topic: kotlin
difficulty: senior
order: 40
starred: false
section: "Code reasoning"
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

**Why:** property initializers and `init` blocks run **in the order they're written**, top to bottom, interleaved - not "all properties, then all inits." The constructor effectively executes them as a single sequence.

**The classic trap** is indirectly reading a property before its initializer
runs:
```kotlin
class Broken {
    init { printLength() }
    val x = "hi"

    private fun printLength() {
        println(x.length) // x's backing field is still null here
    }
}
```
The direct forward reference `init { println(x.length) }` is rejected by the
compiler, but an indirect call can bypass that definite-initialization check.
At runtime the backing field still contains the JVM default `null`, so
`x.length` throws a `NullPointerException`.

**Lesson:** declaration order is execution order. Don't reference a property before its initializer has run.
