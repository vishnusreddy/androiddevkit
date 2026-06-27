---
question: "What does flowOn do, and why is Flow context preservation important?"
topic: coroutines
difficulty: senior
order: 120
starred: true
section: "Flow operators"
tags: ["flow", "flowOn", "context", "threading"]
---

`flowOn(dispatcher)` changes where the part of a Flow **above it** runs. The
collector and operators below it stay in the collector's context.

```kotlin
flow { emit(readFromDisk()) }   // runs on IO
    .map { parse(it) }          // runs on IO (upstream of flowOn)
    .flowOn(Dispatchers.IO)
    .map { toUiModel(it) }      // runs on the collector's context
    .collect { render(it) }     // collector's context (e.g. Main)
```

For example, disk work can run on `Dispatchers.IO` while `collect` remains on
the main thread to update the UI.

**Why not use `withContext` around `emit`?** A `flow` builder expects its values
to be emitted from one consistent coroutine context. Moving only an `emit` call
to another context breaks that rule. Move the upstream Flow with `flowOn`
instead.

```kotlin
// ❌ throws: "Flow invariant is violated"
flow { withContext(Dispatchers.IO) { emit(load()) } }

// ✅ use flowOn instead
flow { emit(load()) }.flowOn(Dispatchers.IO)
```

The rule keeps threading predictable. You can read a Flow chain from bottom to
top and see which part changes dispatcher.

**Key points:** multiple `flowOn`s each govern the segment above them; the **terminal `collect`** runs in whatever context calls it (often `Main`), which is exactly what you want for updating UI.
