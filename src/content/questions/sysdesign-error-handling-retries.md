---
question: "When should a mobile app retry a failed network request?"
topic: system-design
difficulty: mid
tags: ["system-design", "resilience", "retry", "networking"]
---

Robust retry logic distinguishes **what** to retry, **how** to space attempts, and **when to stop**.

**Classify the error first:**
- **Transient** (timeouts, `IOException`, 5xx, 429) → **retry**.
- **Permanent** (4xx like 400/401/403/404, validation) → **don't retry**; surface to the user or refresh auth (401).
- **`CancellationException`** → never retry; rethrow.

**Exponential backoff with jitter:**
```kotlin
suspend fun <T> retry(maxAttempts: Int = 4, base: Long = 500, block: suspend () -> T): T {
    var attempt = 0
    while (true) {
        try { return block() }
        catch (e: IOException) {
            if (++attempt >= maxAttempts) throw e
            val delayMs = base * (1L shl (attempt - 1))        // 500, 1000, 2000…
            val jitter = Random.nextLong(0, delayMs / 2)        // avoid thundering herd
            delay(delayMs + jitter)
        }
    }
}
```
- **Exponential** spacing avoids hammering a struggling server.
- **Jitter** (randomness) prevents synchronized retries from many clients (the **thundering herd**).
- **Cap** attempts and total time; respect a **`Retry-After`** header on 429/503.

**Idempotency:**
- Only safely retry **idempotent** operations. For non-idempotent writes (create order), send an **idempotency key** so a retried request the server already processed isn't applied twice.

**Circuit breaker (for a repeatedly failing dependency):**
- After N consecutive failures, **open** the circuit - fail fast for a cooldown instead of retrying every call (which wastes battery and piles load on a down service).
- After the cooldown, allow a trial request (**half-open**); success **closes** it, failure re-opens.

**Surfacing to the user:**
- Map errors to **typed domain results** → UI state (retry button, offline banner, re-login).
- **Optimistic UI** with rollback on permanent failure.

**Trade-offs to name:** retry count/backoff (success rate vs battery/data/latency), at-least-once + idempotency (reliability vs server complexity), circuit breaker (protecting the backend & battery vs delayed recovery), aggressive vs conservative timeouts.
