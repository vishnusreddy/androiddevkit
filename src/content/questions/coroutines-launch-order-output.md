---
question: "In what order do launched coroutines run when they call delay?"
topic: coroutines
difficulty: mid
order: 210
starred: false
section: "Concurrency code reasoning"
tags: ["coroutines", "output-based", "concurrency"]
---

```kotlin
fun main() = runBlocking {
    println("1")
    launch {
        println("2")
        delay(100)
        println("3")
    }
    launch {
        println("4")
        delay(50)
        println("5")
    }
    println("6")
}
```

**Output:**

```
1
6
2
4
5
3
```

**Why, step by step:**
1. `println("1")` runs.
2. The first `launch` **schedules** a coroutine but doesn't run it yet (it's dispatched); execution continues.
3. The second `launch` likewise schedules.
4. `println("6")` runs - we're still in the `runBlocking` body, which hasn't suspended.
5. Now the body finishes its synchronous part; the launched coroutines run. First coroutine prints `2`, hits `delay(100)` and suspends. Second prints `4`, hits `delay(50)` and suspends.
6. After ~50ms the second resumes → `5`. After ~100ms the first resumes → `3`.

**Key teaching points:**
- `launch` doesn't run its body immediately - it dispatches it. The current coroutine keeps going until it suspends or completes, which is why `6` prints before `2`.
- `delay` is **non-blocking** suspension, so both coroutines wait concurrently; the 50ms one finishes first (`5` before `3`).
- `runBlocking` keeps the main thread alive until **all** child coroutines complete.
