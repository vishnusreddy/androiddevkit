---
question: "How do you handle exceptions in a Flow? What is exception transparency?"
topic: coroutines
difficulty: senior
tags: ["flow", "error-handling", "catch"]
---

Handle flow errors with the **`catch`** operator, not a `try/catch` wrapped around the chain — and never `try/catch` *inside* the `flow { }` builder around `emit`.

```kotlin
repository.observe()
    .map { transform(it) }
    .catch { e -> emit(fallbackValue) }   // catches upstream errors
    .onEach { render(it) }
    .launchIn(viewModelScope)
```

**Exception transparency** is the design principle behind this: a flow must **never catch exceptions from its downstream** (the collector). A `catch` operator only handles exceptions from operators **above** it — emissions, `map`, the builder. An exception thrown in `collect` (downstream) is *not* caught by an upstream `catch`.

```kotlin
flow { emit(1) }
    .catch { /* will NOT catch the error below — it's downstream */ }
    .collect { throw RuntimeException() }   // propagates to the collector's scope
```

Why this rule exists: it keeps error handling **local and predictable**. An operator can only deal with failures of the work it declares above it; the collector's own bugs surface where the collector runs.

**Practical toolkit:**
- **`catch`** — recover from upstream errors (emit a fallback, log, map to an error state).
- **`retry(n)` / `retryWhen`** — re-subscribe to the upstream on failure (great for flaky network flows, often with exponential backoff).
- **`onCompletion { cause -> }`** — runs on success *and* failure (cause is non-null on error) — use for cleanup, not recovery.
- For the **collector's** errors, use a normal `try/catch` around `collect`, or handle them in the coroutine's scope.

**Anti-pattern:** wrapping `emit()` in a `try/catch` inside `flow { }` — it can swallow `CancellationException` and breaks transparency. Use the `catch` operator instead.
