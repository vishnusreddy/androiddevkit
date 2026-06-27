---
question: "How do you implement a Singleton in Kotlin, and what are the pitfalls?"
topic: architecture
difficulty: mid
tags: ["design-patterns", "singleton", "kotlin"]
---

A **Singleton** ensures a class has **one instance** with a global access point. In Kotlin it's trivial — `object` gives you a thread-safe, lazily-initialized singleton:

```kotlin
object AnalyticsTracker {
    fun track(event: String) { /* ... */ }
}
AnalyticsTracker.track("open")   // single instance, created on first use
```

The compiler handles thread-safe lazy init — no double-checked-locking boilerplate like Java.

**Pitfalls interviewers want you to name:**

1. **Holding a `Context`/`View` leaks it.** An `object` lives for the whole process. If it stores an **Activity** context, that Activity can never be GC'd. Store **`applicationContext`** only, or don't hold context at all.
   ```kotlin
   object Bad { lateinit var ctx: Context }   // if assigned an Activity → permanent leak
   ```
2. **Global mutable state** — singletons holding mutable state create hidden coupling, make code **hard to test** (shared state bleeds across tests), and cause race conditions if not synchronized.
3. **Testability** — a hard-coded `object` dependency can't be swapped for a fake. This is the big one: prefer **DI with `@Singleton`** scope over a manual `object`, so the single instance is *provided* and *replaceable in tests*.
4. **Initialization order / parameters** — an `object` can't take constructor parameters; if it needs config, you end up with an `init(context)` method and ordering hazards.

**The recommended approach:** use a normal class and let **Hilt/Dagger** provide it as `@Singleton`. You get one instance **and** testability/injectability — the benefits without the global-state/leak downsides.

**Soundbite:** "`object` is Kotlin's thread-safe lazy singleton, but watch for context leaks (use app context), global mutable state, and untestability. For app singletons, prefer DI `@Singleton` so the instance is injected and swappable in tests rather than a hard `object`."
