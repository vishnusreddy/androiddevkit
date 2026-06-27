---
question: "Explain the coroutine dispatchers: Main, IO, Default, Unconfined. When do you use each?"
topic: coroutines
difficulty: junior
order: 40
starred: true
section: "Coroutine foundations"
tags: ["coroutines", "dispatchers", "threading"]
---

A dispatcher decides **which thread(s)** a coroutine runs on.

- **`Dispatchers.Main`** - the Android UI thread. Use for touching views/Compose state. `Main.immediate` runs synchronously if you're already on Main, avoiding an extra re-dispatch.
- **`Dispatchers.IO`** - an elastic dispatcher tuned for **blocking I/O**: legacy network calls, file reads, and blocking database APIs. Its default parallelism limit is at least 64 or the number of CPU cores (whichever is larger), and it shares threads with `Default`.
- **`Dispatchers.Default`** - a pool sized to the **number of CPU cores**, for **CPU-bound** work: parsing, sorting, JSON, image processing.
- **`Dispatchers.Unconfined`** - starts in the calling thread and resumes in whatever thread the suspending function used. Rarely used in app code; mainly for specific library/testing cases.

```kotlin
suspend fun loadAndProcess(): Result = withContext(Dispatchers.IO) {
    val raw = legacyBlockingApi.download()      // blocking I/O → IO pool
    withContext(Dispatchers.Default) {
        parseAndSort(raw)                       // CPU-heavy → Default
    }
}
```

**Key points interviewers probe:**
- **IO vs Default** is the most-asked distinction: IO for *waiting* (blocking calls), Default for *computing*. They actually share threads, but IO permits many more concurrent blocking ops.
- Main-safe suspending APIs such as Retrofit's suspend support and Room's suspend queries already keep blocking work off Main; don't add an IO hop by reflex. Check the API contract.
- `withContext(Dispatchers.IO)` is preferred over `launch(Dispatchers.IO)` for "do this blocking thing and give me the result."
- **`limitedParallelism(n)`** carves a bounded view out of a dispatcher to cap concurrency (e.g. one network host).
