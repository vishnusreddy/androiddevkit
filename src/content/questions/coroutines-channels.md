---
question: "What is a Channel, how does it differ from a Flow, and what are the channel types?"
topic: coroutines
difficulty: senior
tags: ["coroutines", "channels", "flow"]
---

A **`Channel`** is a coroutine-friendly **queue** for passing values between coroutines - a hot, **stateful** primitive. One coroutine `send`s, another `receive`s; each element is delivered to exactly **one** receiver.

```kotlin
val channel = Channel<Int>()
launch { for (x in 1..3) channel.send(x) ; channel.close() }
launch { for (x in channel) println(x) }   // 1 2 3
```

**Channel vs Flow:**
- A **Flow** is a cold *recipe* - declarative, re-runs per collector, no buffering by itself.
- A **Channel** is hot communication - values exist whether or not anyone reads, and each value goes to **one** consumer (not broadcast).
- In practice you rarely expose a raw `Channel`; you wrap it in `receiveAsFlow()` / `callbackFlow` / use `SharedFlow`. Channels back `callbackFlow` and `produce`.

**Channel types (by buffer capacity):**
- **`RENDEZVOUS`** (default, 0) - `send` suspends until a `receive` is ready. Tight handoff.
- **`BUFFERED`** - a default-sized buffer; `send` only suspends when full.
- **`CONFLATED`** - keeps only the **latest**; new sends overwrite the unread value, never suspend.
- **`UNLIMITED`** - unbounded buffer; `send` never suspends (watch memory).

**When to use a Channel directly:** producer/consumer pipelines, fan-out work distribution, or one-time events where exactly-once delivery to a single consumer matters. For state or broadcast-to-many, prefer `StateFlow`/`SharedFlow`.
