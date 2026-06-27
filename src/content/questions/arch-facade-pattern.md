---
question: "Explain the Facade pattern and how it relates to the Repository."
topic: architecture
difficulty: junior
tags: ["design-patterns", "facade", "repository"]
---

A **Facade** provides a **simple, unified interface** over a complex subsystem, hiding its internal parts from callers.

```kotlin
// Facade over several subsystems
class MediaFacade(
    private val downloader: Downloader,
    private val decoder: Decoder,
    private val cache: MediaCache,
) {
    suspend fun play(url: String) {          // one simple call...
        val bytes = cache.get(url) ?: downloader.fetch(url).also { cache.put(url, it) }
        val media = decoder.decode(bytes)    // ...hides downloader + decoder + cache
        player.start(media)
    }
}
```

The caller uses `play(url)` and never touches the downloader, decoder, or cache directly.

**Why use it:**
- **Simplifies usage** - clients deal with one entry point instead of orchestrating many classes.
- **Decouples** clients from subsystem internals - you can restructure the subsystem without breaking callers.
- **Reduces coupling** and centralizes a workflow.

**How it relates to the Repository:** a **Repository is essentially a Facade** over data sources - it hides the network client, database, cache, and the coordination logic behind a clean API (`observeUser()`), so the ViewModel doesn't know whether data came from Room or Retrofit. Many Android "manager"/"controller" classes are facades too.

**Other Android examples:** a `SessionManager` wrapping token storage + refresh + auth headers; an `AnalyticsFacade` over multiple analytics SDKs; `Retrofit` itself is a facade over OkHttp + converters + call adapters.

**Caution:** a facade can grow into a **God object** if it accumulates too many responsibilities - keep it focused on *simplifying access*, not *doing everything*.
