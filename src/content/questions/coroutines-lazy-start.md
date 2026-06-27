---
question: "What is CoroutineStart.LAZY, and how does a lazy async behave?"
topic: coroutines
difficulty: mid
tags: ["coroutines", "async", "lazy"]
---

By default `launch`/`async` start **immediately** (dispatched right away). Passing `start = CoroutineStart.LAZY` makes the coroutine **not start until you trigger it** — via `start()`, `join()`, or (for `async`) `await()`.

```kotlin
val deferred = async(start = CoroutineStart.LAZY) {
    expensiveComputation()
}
// ...nothing has run yet...
if (needed) {
    val result = deferred.await()   // NOW it starts and we wait
}
```

**Use cases:**
- Defer expensive work you **might not need**.
- Set up several coroutines and start them at a controlled moment.

**The big gotcha:** with lazy `async`, if you build multiple deferreds and only `await` them one-by-one, they run **sequentially**, not in parallel — each only starts at its `await()`. To parallelize lazy ones, explicitly `start()` them all first:

```kotlin
val a = async(start = LAZY) { taskA() }
val b = async(start = LAZY) { taskB() }
a.start(); b.start()        // kick both off concurrently
a.await(); b.await()
```

**Other `CoroutineStart` values to know:**
- `DEFAULT` — start immediately (the normal behavior).
- `LAZY` — start on demand.
- `ATOMIC` — start even if cancelled before dispatch (runs to the first suspension point).
- `UNDISPATCHED` — run in the current thread until the first suspension, skipping the dispatcher.

**Soundbite:** "`LAZY` defers start until `await`/`start`/`join` — handy for optional work, but await-ing lazies one at a time serializes them."
