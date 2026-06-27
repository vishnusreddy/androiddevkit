---
question: "What are lifecycle-aware components? (Lifecycle, LifecycleObserver, DefaultLifecycleObserver)"
topic: android-fundamentals
difficulty: mid
tags: ["lifecycle", "jetpack", "architecture"]
---

Lifecycle-aware components **observe** an owner's lifecycle and react automatically, instead of you manually wiring start/stop logic into Activity/Fragment callbacks.

The pieces (from `androidx.lifecycle`):
- **`Lifecycle`** — holds the current **state** (`INITIALIZED`, `CREATED`, `STARTED`, `RESUMED`, `DESTROYED`) and dispatches **events** (`ON_CREATE`, `ON_START`, …).
- **`LifecycleOwner`** — anything with a `Lifecycle` (Activity, Fragment, `viewLifecycleOwner`, NavBackStackEntry, the process via `ProcessLifecycleOwner`).
- **`LifecycleObserver`** — an object that observes those events; implement **`DefaultLifecycleObserver`** for clean callbacks.

```kotlin
class LocationTracker(private val client: LocationClient) : DefaultLifecycleObserver {
    override fun onStart(owner: LifecycleOwner) = client.start()
    override fun onStop(owner: LifecycleOwner)  = client.stop()
}

// In the Activity/Fragment:
lifecycle.addObserver(LocationTracker(client))   // auto start/stop with the lifecycle
```

**Why it matters:**
- **No leaks / no boilerplate** — the component starts and stops itself with the owner; you don't sprinkle `start()`/`stop()` across `onStart`/`onStop` and risk forgetting one.
- **Reusable & testable** — the logic lives in one self-contained class, not the Activity.
- It's the foundation under **`LiveData`** (only updates active observers), **`lifecycleScope`**, **`repeatOnLifecycle`**, and **`viewModelScope`**.

**Related:**
- **`ProcessLifecycleOwner`** observes the **whole app** going to foreground/background (e.g. lock the app when backgrounded).
- Prefer **`DefaultLifecycleObserver`** over the old annotation-based `@OnLifecycleEvent` (deprecated).

**Soundbite:** "Lifecycle-aware components observe a `LifecycleOwner` and self-manage start/stop via `DefaultLifecycleObserver` — no manual callback wiring, no leaks. It's what powers LiveData, `lifecycleScope`, and `repeatOnLifecycle`."
