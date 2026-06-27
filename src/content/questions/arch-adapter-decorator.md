---
question: "Explain the Adapter and Decorator patterns with Android examples."
topic: architecture
difficulty: mid
tags: ["design-patterns", "adapter", "decorator"]
---

Two structural patterns that are easy to confuse.

**Adapter** — converts one interface into another the client expects. It **wraps** an incompatible type to make it usable.
```kotlin
// Adapt a domain list to what RecyclerView expects
class UserAdapter(val users: List<User>) : RecyclerView.Adapter<UserVH>() { ... }
```
*Android examples:* **`RecyclerView.Adapter`** (the name says it — adapts data to view-holders), **`PagerAdapter`**, wrapping a third-party SDK's interface behind your own (`AnalyticsClient` interface adapting Firebase/Amplitude), or a Retrofit `CallAdapter`. Use it to make **incompatible interfaces work together**, especially to wrap libraries you don't control behind your own abstraction (an **anti-corruption layer**).

**Decorator** — **adds behavior** to an object dynamically by wrapping it in another object with the **same** interface, without changing the original.
```kotlin
interface DataSource { suspend fun load(key: String): String }

class CachingDataSource(private val wrapped: DataSource) : DataSource {
    private val cache = mutableMapOf<String, String>()
    override suspend fun load(key: String) =
        cache.getOrPut(key) { wrapped.load(key) }   // adds caching, same interface
}

class LoggingDataSource(private val wrapped: DataSource) : DataSource {
    override suspend fun load(key: String): String {
        Log.d("DS", "load $key"); return wrapped.load(key)
    }
}
```
*Android examples:* **OkHttp `Interceptor`s** (each wraps the chain, adding logging/auth/caching), **`ContextWrapper`** (and `ContextThemeWrapper`), input stream wrappers (`BufferedInputStream`). You can **stack** decorators (`Logging(Caching(real))`) to compose behavior.

**The distinction:**
- **Adapter** = *change the interface* (make B usable as A).
- **Decorator** = *same interface, add responsibilities* (wrap to enhance).

**Soundbite:** "Adapter converts an interface so incompatible types work together (`RecyclerView.Adapter`, wrapping SDKs); Decorator keeps the same interface and layers on behavior (OkHttp Interceptors, `ContextWrapper`). Adapter changes shape; Decorator adds capability."
