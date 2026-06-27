---
question: "What does runBlocking do, and when should (and shouldn't) you use it?"
topic: coroutines
difficulty: mid
tags: ["coroutines", "runBlocking", "testing"]
---

`runBlocking` is a **bridge from regular blocking code into the coroutine world**. It starts a coroutine and **blocks the current thread** until that coroutine and all its children complete.

```kotlin
fun main() = runBlocking {   // blocks main until done
    val data = repository.load()
    println(data)
}
```

**Where it's appropriate:**
- **`main()`** functions and simple scripts.
- **Tests** — though `runTest` is now preferred for coroutine tests (it skips delays and controls virtual time).
- Bridging a suspend function into a **legacy blocking API** you must implement.

**Where it's dangerous:**
- **Never on the main/UI thread in an app** — it blocks the thread, defeating the entire point of coroutines and risking ANRs. This is the #1 misuse interviewers watch for.
- Inside another coroutine — you'd block a pool thread instead of suspending. Use `withContext`/`coroutineScope` instead.

**Contrast with `coroutineScope`:** both wait for children, but `coroutineScope` **suspends** (releases the thread) while `runBlocking` **blocks** (holds the thread). Inside coroutine code you want `coroutineScope`; only use `runBlocking` to *enter* coroutine code from a non-suspending context.

**Soundbite:** "`runBlocking` blocks a thread to run coroutines — fine for `main` and tests, a bug on the UI thread."
