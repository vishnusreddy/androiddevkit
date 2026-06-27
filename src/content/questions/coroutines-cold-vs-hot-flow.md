---
question: "What is the difference between a cold Flow and a hot Flow?"
topic: coroutines
difficulty: mid
tags: ["flow", "cold-hot", "stateflow", "sharedflow"]
---

**Cold flow** (`flow { }`, `flowOf`, Room/Retrofit flows): the producer block runs **per collector**, starting **only when collected**. Two collectors get two independent executions from the start. No collector = no work.

```kotlin
val numbers = flow {
    println("start")        // runs each time someone collects
    emit(1); emit(2)
}
```

**Hot flow** (`StateFlow`, `SharedFlow`): emits **regardless of collectors**, and all collectors share the **same** stream. Late collectors miss past emissions (except replay/the current value).

| | Cold (`Flow`) | Hot (`StateFlow` / `SharedFlow`) |
|---|---|---|
| Starts when | collected | exists independently |
| Per-collector execution | yes | shared |
| Has a current value | no | `StateFlow`: yes / `SharedFlow`: optional replay |
| Use for | one-shot data, transformations | observable app state, events |

**`StateFlow`** = hot, always has **one current value**, conflated, deduplicated (`distinctUntilChanged` built in). Great for UI state.

**`SharedFlow`** = hot, configurable `replay` and buffer, no "current value" requirement. Great for one-off events (navigation, snackbars) where you don't want replay on rotation.

**Bridging them:** convert a cold flow to hot with **`stateIn`** / **`shareIn`**, so an upstream (e.g. a DB query) runs once and is shared across collectors instead of re-running per subscriber.
