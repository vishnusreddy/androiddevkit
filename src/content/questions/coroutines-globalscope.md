---
question: "Why is GlobalScope considered an anti-pattern?"
topic: coroutines
difficulty: mid
tags: ["coroutines", "globalscope", "structured-concurrency"]
---

`GlobalScope` launches coroutines that live for the **entire application lifetime** and belong to **no parent**. That breaks structured concurrency and causes real problems:

- **Leaks** — the coroutine isn't tied to any lifecycle, so it keeps running after the screen (and the objects it references) is gone. A `GlobalScope.launch` capturing a `ViewModel` or `Context` leaks it.
- **No cancellation** — nothing cancels it. You can't stop it when the user navigates away; it runs to completion regardless.
- **Orphaned errors** — exceptions don't propagate to any parent scope, so failures can vanish or crash unexpectedly.
- **Hard to test** — there's no scope to control or wait on in tests.

```kotlin
// ❌ leaks, never cancelled, error goes nowhere useful
GlobalScope.launch { repo.sync() }

// ✅ tied to the ViewModel lifecycle
viewModelScope.launch { repo.sync() }
```

**Use a lifecycle-bound scope instead:** `viewModelScope`, `lifecycleScope`, or an **application-scoped** `CoroutineScope` you create and inject (with a `SupervisorJob`) for genuinely app-lifetime work (e.g. a sync that must outlive a screen).

```kotlin
@Singleton
class AppScope @Inject constructor() :
    CoroutineScope by CoroutineScope(SupervisorJob() + Dispatchers.Default)
```

**The rare legit case:** truly application-lifetime, fire-and-forget work with no lifecycle — but even then, an injected app scope is preferable because it's testable and controllable. `GlobalScope` is marked `@DelicateApi` for exactly these reasons.
