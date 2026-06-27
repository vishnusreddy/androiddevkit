---
question: "When should an API return a suspend value, a Flow, or a Sequence?"
topic: coroutines
difficulty: junior
order: 75
starred: true
section: "Flow foundations"
tags: ["coroutines", "flow", "suspend", "sequence", "api-design"]
---

Choose based on **how many values arrive** and **whether producing them may suspend**.

| API shape | Values | Can suspend between values? | Typical use |
|---|---:|---:|---|
| `suspend fun load(): User` | one result | yes | one network/database operation |
| `fun observe(): Flow<User>` | zero to many over time | yes | database updates, UI state, events |
| `fun parse(): Sequence<Row>` | many, pulled synchronously | no | lazy in-memory or blocking iteration |

```kotlin
suspend fun user(id: Long): User = api.fetchUser(id) // one eventual answer

fun observeUser(id: Long): Flow<User> =
    dao.observeUser(id)                              // updates over time
```

A `suspend` function does not imply a background thread; it returns one result and may suspend while obtaining it. A cold `Flow` is also lazy, but collection can receive multiple values and is cancelled with the collecting coroutine. A `Sequence` is lazy but synchronous. Its iterator cannot call suspending APIs.

**Interview trap:** do not return `Flow` merely to wrap one network response. A suspend function is clearer unless the operation genuinely emits progress, retries as values, or later updates.
