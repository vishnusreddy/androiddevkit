---
question: "What's the output? delay vs Thread.sleep inside coroutines."
topic: coroutines
difficulty: mid
tags: ["coroutines", "output-based", "delay", "blocking"]
---

```kotlin
fun main() = runBlocking {
    val time = measureTimeMillis {
        val a = launch { delay(500); println("A") }
        val b = launch { delay(500); println("B") }
    }
    println("Done in ~${time}ms")
}
```

This prints `A`, `B`, and **"Done in ~0ms"** — wait, why 0? Because `measureTimeMillis` only measures the time to *launch* the two coroutines (which return immediately); `runBlocking` then waits for them after the block. The two `delay(500)`s overlap, so the program finishes in ~500ms total.

Now swap `delay` for `Thread.sleep` on a **single-threaded** dispatcher:

```kotlin
runBlocking {                     // single thread
    launch { Thread.sleep(500); println("A") }
    launch { Thread.sleep(500); println("B") }
}                                  // takes ~1000ms — they run sequentially!
```

**Why:** `delay` is a **suspending** function — it releases the thread, so both coroutines wait concurrently (~500ms total). `Thread.sleep` **blocks** the thread; on a single-threaded dispatcher the second coroutine can't even start until the first unblocks, so the sleeps run back-to-back (~1000ms).

**The lesson:** never use `Thread.sleep` (or any blocking call) inside a coroutine without moving it to an appropriate dispatcher — it blocks a pooled thread, kills concurrency, and on `Main` causes ANRs. Use `delay` for waiting, `withContext(Dispatchers.IO)` for unavoidable blocking work.
