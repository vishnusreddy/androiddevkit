---
question: "Why should you inject coroutine dispatchers instead of hardcoding them?"
topic: architecture
difficulty: senior
tags: ["coroutines", "dispatchers", "testing", "dependency-injection"]
---

Hardcoding `Dispatchers.IO`/`Default` couples your code to real threads, which makes it **non-deterministic in tests**. Injecting dispatchers makes threading **configurable and testable**.

**The problem with hardcoding:**
```kotlin
class Repo(private val api: Api) {
    suspend fun load() = withContext(Dispatchers.IO) { api.fetch() }  // ❌ real IO in tests
}
```
In tests you can't control this — `runTest`'s virtual clock doesn't govern a real `Dispatchers.IO`, so timing is unpredictable and tests can be flaky.

**The fix — inject the dispatcher:**
```kotlin
class Repo(
    private val api: Api,
    private val ioDispatcher: CoroutineDispatcher = Dispatchers.IO,
) {
    suspend fun load() = withContext(ioDispatcher) { api.fetch() }
}

// Test: pass a TestDispatcher
val repo = Repo(fakeApi, UnconfinedTestDispatcher())
```

**Provide them via DI with qualifiers** so the right one is injected everywhere:
```kotlin
@Qualifier annotation class IoDispatcher
@Qualifier annotation class DefaultDispatcher

@Provides @IoDispatcher fun io(): CoroutineDispatcher = Dispatchers.IO
```
A common pattern is a `DispatcherProvider` interface (`io`, `default`, `main`) injected into repositories/use cases, with a test implementation returning a single `TestDispatcher`.

**Benefits:**
- **Deterministic tests** — `runTest` controls the virtual clock; `advanceUntilIdle()` works; no flakiness.
- **Flexibility** — swap dispatchers per environment without touching logic.
- **Honors structured concurrency** — `viewModelScope` already uses `Main`; you only switch for blocking/CPU work, and now that switch is testable.

**Soundbite:** "Inject dispatchers (via a qualifier or a `DispatcherProvider`) instead of hardcoding `Dispatchers.IO` — tests can then substitute a `TestDispatcher` so `runTest`'s virtual clock controls timing, making coroutine code deterministic and flake-free."
