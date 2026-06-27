---
question: "What happens when async fails and its result is never awaited?"
topic: coroutines
difficulty: senior
order: 90
starred: false
section: "Concurrency code reasoning"
tags: ["coroutines", "output-based", "exceptions", "async"]
---

```kotlin
fun main() = runBlocking {
    val deferred = async {
        throw RuntimeException("boom")
    }
    delay(100)
    println("after delay")
    // note: we never call deferred.await()
}
```

**Output:** the program **crashes** - `RuntimeException: boom` propagates and `"after delay"` does **not** print.

**Why this surprises people:** they expect that because `async` "stores" its exception for `await()`, not awaiting means the exception is harmless. But here `async` is a child of `runBlocking`, whose context has a **regular `Job`**. When the child fails, structured concurrency propagates the failure to the **parent**, cancelling it - independent of whether you ever call `await()`. So the whole `runBlocking` fails.

The "exception is deferred to `await()`" rule only describes *where you can catch it*; it does **not** stop the failure from propagating up the Job hierarchy and cancelling the parent.

**To actually isolate it**, give the `async` a supervisor parent so its failure doesn't cancel the parent:
```kotlin
supervisorScope {
    val d = async { throw RuntimeException("boom") }
    delay(100)
    println("after delay")     // now prints
    // exception only surfaces if/when you await d
}
```

**Lesson:** under a normal `Job`, an unhandled `async` failure still tears down the scope. Use `supervisorScope`/`SupervisorJob` for independent children, and remember `await()` is where you *observe* the exception, not what *triggers* propagation.
