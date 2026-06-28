---
question: "What do produceState and snapshotFlow do?"
topic: jetpack-compose
difficulty: senior
order: 130
starred: false
section: "Effects and lifecycle"
tags: ["compose", "side-effects", "produceState", "snapshotFlow"]
---

Both bridge between Compose state and coroutines/flows, in opposite directions.

**`produceState`** - turn a **coroutine/async source into Compose `State`**. It launches a coroutine (like `LaunchedEffect`) and gives you a `value` you set over time.

```kotlin
@Composable
fun userState(userId: String): State<Result<User>> = produceState(
    initialValue = Result.Loading,
    key1 = userId,
) {
    value = try { Result.Success(repo.load(userId)) }
            catch (e: Exception) { Result.Error(e) }
    // optional awaitDispose { } for cleanup
}
```
It's essentially `remember { mutableStateOf(initial) }` + `LaunchedEffect` combined - ideal for "load this async and expose it as state."

**`snapshotFlow`** - the reverse: turn **Compose `State` reads into a `Flow`**. It observes the state read inside its block and emits when that state changes.

```kotlin
LaunchedEffect(listState) {
    snapshotFlow { listState.firstVisibleItemIndex }
        .distinctUntilChanged()
        .filter { it > 10 }
        .collect { analytics.log("scrolled deep") }
}
```
Use it to apply **Flow operators** (`debounce`, `filter`, `map`) to Compose state, or to react to scroll/gesture state with coroutine logic.

**How to choose:**
- Async data → Compose state to render: **`produceState`**.
- Compose state → a Flow to process with operators or side effects: **`snapshotFlow`**.

Both are lifecycle-scoped to the composition and cancel when it leaves.
