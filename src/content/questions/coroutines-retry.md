---
question: "How do you retry a failing Flow with exponential backoff?"
topic: coroutines
difficulty: mid
order: 30
starred: false
section: "Flow sharing and reliability"
tags: ["flow", "retry", "practical", "error-handling"]
---

Use **`retryWhen`** (or `retry`) to re-subscribe to the upstream when it throws, with a delay between attempts.

```kotlin
fun <T> Flow<T>.retryWithBackoff(
    maxAttempts: Int = 3,
    initialDelay: Long = 500,
    factor: Double = 2.0,
): Flow<T> = retryWhen { cause, attempt ->
    if (attempt >= maxAttempts || cause !is IOException) {
        false                                   // stop retrying → error propagates
    } else {
        val delayMs = (initialDelay * factor.pow(attempt.toInt())).toLong()
        delay(delayMs)                          // 500ms, 1s, 2s, ...
        true                                    // retry
    }
}

repository.observe()
    .retryWithBackoff()
    .catch { emit(fallback) }                   // give up gracefully after retries
    .collect { render(it) }
```

Key points:
- **`retry(n) { predicate }`** - simpler: retry up to `n` times while the predicate is true.
- **`retryWhen { cause, attempt -> Boolean }`** - full control: inspect the **exception type** and **attempt index**, `delay()` for backoff, return `true` to retry / `false` to give up.
- **Only retry transient failures.** Check the cause - retry `IOException`/timeouts, but *not* a 4xx auth error or a `CancellationException` (never retry cancellation).
- Pair with **`catch`** as a final fallback so the UI shows an error state after retries are exhausted.
- Add **jitter** (a small random offset) in production to avoid thundering-herd retries.
