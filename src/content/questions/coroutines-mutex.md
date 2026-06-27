---
question: "How do you protect shared mutable state in coroutines? Mutex vs synchronized."
topic: coroutines
difficulty: senior
tags: ["coroutines", "concurrency", "mutex"]
---

Coroutines run concurrently, so shared mutable state still needs protection - but you should **avoid blocking locks**.

**Don't use `synchronized` / `ReentrantLock`** around suspending code: they **block the thread**, defeating coroutines, and you can't `suspend` while holding them.

Options, best-first:

**1. Avoid shared state.** The cleanest fix - confine state to a single coroutine, or use immutable data + `StateFlow.update { }` (atomic, lock-free):
```kotlin
_state.update { it.copy(count = it.count + 1) }   // atomic compare-and-set
```

**2. `Mutex`** - a coroutine-aware lock that **suspends** instead of blocking:
```kotlin
val mutex = Mutex()
suspend fun increment() = mutex.withLock { counter++ }
```

**3. Confine to a single-threaded dispatcher** - `withContext(singleThreadDispatcher)` or `Dispatchers.Default.limitedParallelism(1)` serializes access without a lock.

**4. Atomics** (`AtomicInteger`, `atomicfu`) for simple counters.

**What to remember:**
- `Mutex.withLock` is the coroutine equivalent of `synchronized`, but it suspends - no thread blocked.
- `Mutex` is **not reentrant** (locking it twice in the same coroutine deadlocks), unlike `synchronized`.
- For UI state, prefer `StateFlow.update {}` over any lock - it's atomic and idiomatic.
