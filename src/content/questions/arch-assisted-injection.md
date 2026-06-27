---
question: "What is assisted injection, and when do you need it?"
topic: architecture
difficulty: senior
tags: ["hilt", "dagger", "assisted-injection", "dependency-injection"]
---

**Assisted injection** is for objects that need **both** DI-provided dependencies **and** runtime parameters only known at the call site (an item id, a config object). DI provides some constructor args; the caller "assists" with the rest.

```kotlin
class DetailViewModel @AssistedInject constructor(
    private val repo: ItemRepository,      // provided by DI
    @Assisted private val itemId: String,  // provided at runtime
) : ViewModel() {

    @AssistedFactory
    interface Factory {
        fun create(itemId: String): DetailViewModel
    }
}
```
The `@AssistedFactory` interface is what you inject; you call `factory.create(itemId)` with the runtime value.

**Why you need it:** Dagger/Hilt can only provide what's in the graph. A pure `@Inject` constructor can't have a parameter the graph doesn't know (`itemId`). Without assisted injection you'd resort to ugly workarounds (passing the id through a setter after creation, or a manual factory).

**Common Android use cases:**
- A **ViewModel that needs a runtime argument** (though `SavedStateHandle` often covers nav args - Hilt populates it from the back stack, so prefer `SavedStateHandle` when the value is a navigation argument).
- A **WorkManager `Worker`** needing injected deps + runtime `WorkerParameters` - Hilt's `@HiltWorker` + `@AssistedInject` handle exactly this.
- A presenter/use case parameterized by a runtime id or callback.

```kotlin
@HiltWorker
class SyncWorker @AssistedInject constructor(
    @Assisted ctx: Context,
    @Assisted params: WorkerParameters,
    private val repo: SyncRepository,        // injected
) : CoroutineWorker(ctx, params)
```
