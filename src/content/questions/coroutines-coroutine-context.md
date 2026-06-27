---
question: "What is CoroutineContext, and what are its elements?"
topic: coroutines
difficulty: mid
tags: ["coroutines", "context"]
---

A `CoroutineContext` is an **indexed set of elements** that defines how a coroutine behaves. It's like a map keyed by element type, and elements combine with `+`.

The main elements:
- **`Job`** - the coroutine's lifecycle handle (cancellation, parent/child relationship).
- **`CoroutineDispatcher`** - which thread(s) it runs on.
- **`CoroutineName`** - a name for debugging/logging.
- **`CoroutineExceptionHandler`** - last-resort handler for uncaught exceptions.

```kotlin
val scope = CoroutineScope(Dispatchers.Main + SupervisorJob() + CoroutineName("ui"))

scope.launch(Dispatchers.IO + CoroutineName("download")) {
    // context here = parent's, with Dispatcher and Name overridden
}
```

**How it composes (important):**
- A child coroutine **inherits** the parent's context, then applies any overrides you pass to the builder.
- The child always gets a **new `Job`** that is a child of the parent's Job - that's what wires up structured concurrency. (You don't inherit the parent's *Job instance*; you become its child.)
- `coroutineContext[Job]`, `coroutineContext[CoroutineDispatcher]` let you read elements.
