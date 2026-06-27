---
question: "How are coroutines different from threads? Why are they called 'lightweight'?"
topic: coroutines
difficulty: junior
tags: ["coroutines", "threads", "fundamentals"]
---

A **thread** is an OS-level construct with a large fixed stack (~1MB+ on the JVM). Creating thousands is expensive in memory and context-switching. A **coroutine** is a *language-level* construct — essentially a resumable computation — that **runs on top of** threads.

The key differences:
- **Cheap.** You can launch hundreds of thousands of coroutines; they're objects, not OS threads. Many coroutines share a small pool of threads.
- **Suspend, don't block.** A coroutine waiting on I/O **suspends** and frees its thread for other coroutines. A blocked thread sits idle holding its stack.
- **Structured.** Coroutines form parent/child scopes with automatic cancellation and error propagation — threads have none of that.
- **Cooperative scheduling** at suspension points, vs. preemptive OS thread scheduling.

```kotlin
// 100k coroutines — fine. 100k threads — OutOfMemoryError.
repeat(100_000) {
    launch { delay(1000); print(".") }
}
```

**The mental model:** coroutines don't replace threads — they multiplex work *onto* threads efficiently. "Lightweight" means the cost is a small state-machine object plus a continuation, not an OS thread.

**Interview clincher:** "Suspension releases the underlying thread; blocking holds it. That's why a handful of `Dispatchers.IO` threads can serve thousands of concurrent suspended network calls."
