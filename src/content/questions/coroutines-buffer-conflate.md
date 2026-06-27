---
question: "How does Flow handle backpressure? Explain buffer, conflate, and collectLatest."
topic: coroutines
difficulty: mid
order: 150
starred: false
section: "Flow operators"
tags: ["flow", "backpressure", "buffer", "conflate"]
---

By default a Flow is **sequential**: the producer waits for the collector to finish processing each value before emitting the next (suspension is the natural backpressure). When the collector is slower than the producer, you choose a strategy:

**`buffer(capacity)`** - run producer and collector **concurrently**. Emissions go into a buffer so the producer doesn't wait; the collector drains it. Speeds up pipelines where both sides do real work.
```kotlin
flow.buffer().collect { slowProcess(it) }   // producer keeps emitting into buffer
```

**`conflate()`** - keep only the **latest** value; if the collector is busy, intermediate emissions are dropped. Equivalent to `buffer(CONFLATED)`.
```kotlin
fastSensor.conflate().collect { render(it) }  // skip stale frames, render newest
```

**`collectLatest { }`** - like conflate, but it **cancels and restarts** the collector block for each new value (rather than dropping after processing starts).

**How to choose:**
- Need **every** value, just want concurrency → `buffer`.
- Only the **newest** value matters, dropping intermediates is fine → `conflate`.
- Only the newest matters **and** processing the old one should be cancelled → `collectLatest`.

`buffer` also accepts an `onBufferOverflow` policy (`SUSPEND`, `DROP_OLDEST`, `DROP_LATEST`) for fine control.
