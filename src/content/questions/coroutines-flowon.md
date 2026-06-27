---
question: "What does flowOn do, and why is Flow context preservation important?"
topic: coroutines
difficulty: senior
tags: ["flow", "flowOn", "context", "threading"]
---

**`flowOn(dispatcher)`** changes the dispatcher for the **upstream** operators (everything declared *above* it in the chain). It does **not** affect downstream or the collector.

```kotlin
flow { emit(readFromDisk()) }   // runs on IO
    .map { parse(it) }          // runs on IO (upstream of flowOn)
    .flowOn(Dispatchers.IO)
    .map { toUiModel(it) }      // runs on the collector's context
    .collect { render(it) }     // collector's context (e.g. Main)
```

**Context preservation** is a Flow design rule: a flow must emit from a **single, consistent** coroutine context. You're **not allowed** to call `withContext(Dispatchers.IO) { emit(x) }` inside a `flow { }` builder — it violates this and throws `IllegalStateException`. `flowOn` is the *sanctioned* way to shift execution context.

```kotlin
// ❌ throws: "Flow invariant is violated"
flow { withContext(Dispatchers.IO) { emit(load()) } }

// ✅ use flowOn instead
flow { emit(load()) }.flowOn(Dispatchers.IO)
```

**Why the rule exists:** it keeps flows **predictable and composable** — the collector always knows which context emissions arrive on, and operators can reason about threading locally. `flowOn` internally inserts a channel to safely cross the dispatcher boundary.

**Key points:** multiple `flowOn`s each govern the segment above them; the **terminal `collect`** runs in whatever context calls it (often `Main`), which is exactly what you want for updating UI.
