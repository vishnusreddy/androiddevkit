---
question: "Explain the coroutine dispatchers: Main, IO, Default, Unconfined. When do you use each?"
topic: coroutines
difficulty: mid
tags: ["coroutines", "dispatchers", "threading"]
---

A dispatcher decides **which thread(s)** a coroutine runs on.

- **`Dispatchers.Main`** — the Android UI thread. Use for touching views/Compose state. `Main.immediate` runs synchronously if you're already on Main, avoiding an extra re-dispatch.
- **`Dispatchers.IO`** — a large pool (default 64+ threads) tuned for **blocking I/O**: network, disk, database, file reads. Threads here mostly wait, so the pool is big.
- **`Dispatchers.Default`** — a pool sized to the **number of CPU cores**, for **CPU-bound** work: parsing, sorting, JSON, image processing.
- **`Dispatchers.Unconfined`** — starts in the calling thread and resumes in whatever thread the suspending function used. Rarely used in app code; mainly for specific library/testing cases.

```kotlin
suspend fun loadAndProcess(): Result = withContext(Dispatchers.IO) {
    val raw = api.download()                    // blocking I/O → IO pool
    withContext(Dispatchers.Default) {
        parseAndSort(raw)                       // CPU-heavy → Default
    }
}
```

**Key points interviewers probe:**
- **IO vs Default** is the most-asked distinction: IO for *waiting* (blocking calls), Default for *computing*. They actually share threads, but IO permits many more concurrent blocking ops.
- A well-written `suspend` library function (Retrofit, Room) already switches dispatchers internally — you don't wrap it again.
- `withContext(Dispatchers.IO)` is preferred over `launch(Dispatchers.IO)` for "do this blocking thing and give me the result."
- **`limitedParallelism(n)`** carves a bounded view out of a dispatcher to cap concurrency (e.g. one network host).
