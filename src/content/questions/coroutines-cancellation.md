---
question: "How does coroutine cancellation work? Why is it 'cooperative'?"
topic: coroutines
difficulty: senior
tags: ["coroutines", "cancellation"]
---

Cancellation is **cooperative**: cancelling a coroutine sets its `Job` to a cancelling state, but the coroutine only actually stops when it **checks for cancellation**. If your code never checks, it keeps running.

Suspending functions from `kotlinx.coroutines` (`delay`, `withContext`, `yield`, etc.) check automatically and throw `CancellationException` when cancelled. But a tight CPU loop won't:

```kotlin
// ❌ Ignores cancellation — runs to completion even after cancel()
launch {
    while (i < 1_000_000) { heavyStep(i++) }
}

// ✅ Cooperates
launch {
    while (i < 1_000_000) {
        ensureActive()        // throws if cancelled
        heavyStep(i++)
    }
}
```

Ways to cooperate:
- **`ensureActive()`** — throws `CancellationException` if cancelled.
- **`isActive`** — check the flag yourself (`while (isActive) { }`).
- **`yield()`** — checks for cancellation and lets other coroutines run.
- Call any **cancellable suspend function** (`delay`, etc.).

**Critical rules:**
- `CancellationException` is **normal** — don't swallow it. A blanket `try { } catch (e: Exception) { }` will eat it and break cancellation. Catch specific exceptions, or rethrow `CancellationException`.
- To run cleanup that itself suspends (closing a resource), use `withContext(NonCancellable) { }` — the coroutine is already cancelling, so normal suspension would immediately throw.
- `finally` blocks run on cancellation, so they're the place for non-suspending cleanup.

**Soundbite:** "Cancellation is a request, not a kill — your coroutine must reach a suspension point or check `isActive`/`ensureActive` to honor it, and must never swallow `CancellationException`."
