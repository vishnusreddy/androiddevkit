---
question: "collect vs collectLatest, and what do flatMapLatest / mapLatest do?"
topic: coroutines
difficulty: mid
tags: ["flow", "collectLatest", "flatMapLatest"]
---

The `*Latest` variants **cancel the in-progress work when a new value arrives**.

**`collect`** processes every emission to completion, sequentially. If processing is slow, emissions queue up.

**`collectLatest`** starts processing each value, but if a **new** value arrives before the current block finishes, it **cancels** the current block and restarts with the new value.

```kotlin
flow {
    emit("A"); delay(10); emit("B")
}.collectLatest { value ->
    println("start $value")
    delay(100)                 // slow work
    println("done $value")     // only reached for the LAST value
}
// Output: start A, start B, done B   (A's work was cancelled by B)
```

**`flatMapLatest`** / **`mapLatest`** apply the same idea to transformations - cancel the previous inner flow/computation when upstream emits again. This is the common **search-as-you-type** pattern:

```kotlin
queryFlow
    .debounce(300)
    .distinctUntilChanged()
    .flatMapLatest { q -> repo.search(q) }   // cancels the stale search
    .collect { render(it) }
```

**When to use which:**
- Only the latest value matters (UI state, search results) → `collectLatest` / `flatMapLatest`.
- Every value must be processed (analytics events, a write queue) → plain `collect` (with `buffer` if needed).

**Gotcha:** with `collectLatest`, cancellation means the slow block's later lines may never run - don't rely on it for must-complete side effects.
