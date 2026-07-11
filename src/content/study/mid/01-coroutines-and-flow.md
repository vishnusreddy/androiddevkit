---
title: Coroutines, Flow, cancellation, and state streams
description: Use structured concurrency and observable streams to perform asynchronous work without losing cancellation, ownership, or failure semantics.
level: mid
order: 1
duration: 55 min
quizHref: /practice/?test=coroutines-test
quizLabel: Take the Coroutines quiz
---

Coroutines express asynchronous work without blocking a thread, and Flow expresses a sequence of values that changes over time. Neither API grants safety by itself. Correct code must assign each job to an owner, preserve cancellation, classify exceptions, and stop collection when the UI that consumes a value is no longer active.

This chapter treats concurrency as a lifetime problem. A scope defines who may cancel work, a dispatcher defines where a block runs, and a stream defines what the consumer receives when it starts or stops observing. Those choices determine whether a screen shows current state, repeats a request, or leaks work beyond its purpose.

## Learning goals

- Select a scope such as `viewModelScope`, `lifecycleScope`, or `supervisorScope` from the lifetime of the result.
- Explain structured concurrency, cooperative cancellation, and the ownership problem created by `GlobalScope`.
- Choose `withContext`, `async` and `await`, and dispatchers deliberately.
- Build cold Flows, expose hot state with `StateFlow`, and collect with lifecycle awareness.
- Handle exceptions without converting a real failure into silence.

## Structured concurrency in one picture

A coroutine is always a child of a **Job** in a **CoroutineScope**. Cancel the parent → children cancel. The scope’s lifetime should match the **owner** of the result.

| Scope | Lifetime | Use for |
|-------|----------|---------|
| `viewModelScope` | Until ViewModel cleared | Screen state production |
| `lifecycleScope` | Until LifecycleOwner destroyed | UI-instance-bound work |
| `rememberCoroutineScope` | Until composition leaves | Event handlers in Compose |
| `GlobalScope` | Process | Almost never in app code |
| Application-scoped custom scope | App process | Rare process-wide work with clear ownership |

```kotlin
class ArticleViewModel(
    private val repo: ArticleRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow<ArticleUiState>(ArticleUiState.Loading)
    val uiState = _uiState.asStateFlow()

    fun refresh() {
        viewModelScope.launch {
            _uiState.value = ArticleUiState.Loading
            _uiState.value = runCatching { repo.load() }
                .map { ArticleUiState.Content(it) }
                .getOrElse { ArticleUiState.Error(canRetry = true) }
        }
    }
}
```

When the user leaves the screen and the ViewModel is cleared, in-flight `refresh` work is cancelled. That is desirable for UI-bound loads; durable sync may belong in WorkManager instead.

## Suspension is not blocking

`suspend` means the coroutine can pause without blocking its thread. A suspend function can run on the **main thread** unless you switch dispatcher:

```kotlin
suspend fun load(): Article =
    withContext(Dispatchers.IO) {
        api.fetch() // blocking OK here only if truly blocking; prefer suspend API
    }
```

Prefer libraries with suspend APIs (Retrofit suspend, Room suspend/Flow). Use `Dispatchers.IO` for blocking I/O, `Default` for CPU-heavy work, `Main` for UI.

```kotlin
// Good: repository switches context
class ArticleRepository(
    private val api: ArticleApi,
    private val io: CoroutineDispatcher = Dispatchers.IO,
) {
    suspend fun load(): Article = withContext(io) {
        api.fetch().toDomain()
    }
}
```

Inject dispatchers for tests (`StandardTestDispatcher` / `UnconfinedTestDispatcher`).

## `launch` vs `async`

- `launch` - fire-and-forget; returns `Job`.
- `async` - returns `Deferred<T>`; use when you need a result (often with parallel work).

```kotlin
suspend fun loadDashboard(): Dashboard = coroutineScope {
    val user = async { userRepo.me() }
    val feed = async { feedRepo.latest() }
    Dashboard(user.await(), feed.await())
}
```

Use `coroutineScope` so a failure in one child cancels siblings. Use `supervisorScope` when siblings should be independent (one tile failing should not cancel the other).

```kotlin
suspend fun loadTiles(): Tiles = supervisorScope {
    val a = async { runCatching { repoA() }.getOrNull() }
    val b = async { runCatching { repoB() }.getOrNull() }
    Tiles(a.await(), b.await())
}
```

## Cancellation is cooperative

Cancellation throws `CancellationException` inside suspend points. **Do not swallow it** as a generic error:

```kotlin
try {
    repo.sync()
} catch (e: CancellationException) {
    throw e // always rethrow
} catch (e: Exception) {
    showError(e)
}
```

`finally` still runs on cancel - good for closing resources. Use `ensureActive()` or `yield()` in tight CPU loops so cancellation is noticed.

## Exception handling

- Failures in `launch` propagate to the scope’s `CoroutineExceptionHandler` (if any) and cancel the parent job depending on structure.
- `async` defers exceptions until `await`.
- `SupervisorJob` isolates children: one failure does not cancel siblings.

```kotlin
val handler = CoroutineExceptionHandler { _, throwable ->
    logger.error(throwable)
}

viewModelScope.launch(handler) {
    // ...
}
```

Prefer mapping failures into **UI state** for user-visible operations rather than relying only on a global handler.

## Flow: cold streams of values

A **cold** Flow starts work when collected:

```kotlin
fun articles(): Flow<List<Article>> = flow {
    emit(api.fetchAll())
}.map { list -> list.map(ArticleDto::toDomain) }
 .flowOn(Dispatchers.IO)
```

- Upstream builders run per collector (unless shared).
- `map` / `filter` / `combine` / `flatMapLatest` transform streams.
- `flowOn` changes upstream context; collection context stays with the collector.

### Operators mid-level engineers must know

| Operator | Use |
|----------|-----|
| `map` / `filter` | Transform / gate |
| `flatMapLatest` | Cancel previous inner flow (search-as-you-type) |
| `debounce` / `sample` | Rate-limit |
| `catch` | Recover upstream exceptions |
| `retry` / `retryWhen` | Transient failures |
| `onStart` / `onCompletion` | Side signals |
| `stateIn` / `shareIn` | Cold → hot |

```kotlin
val query = MutableStateFlow("")

val results: StateFlow<List<ItemUi>> = query
    .debounce(300)
    .flatMapLatest { q ->
        if (q.isBlank()) flowOf(emptyList())
        else repo.search(q)
    }
    .map { it.map(Item::toUi) }
    .stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = emptyList(),
    )
```

`flatMapLatest` is the correct default for search: a new keystroke cancels the outdated request.

## StateFlow vs SharedFlow vs LiveData

| Type | Behavior | Typical use |
|------|----------|-------------|
| `StateFlow` | Hot, conflated, always has value | Screen UI state |
| `SharedFlow` | Hot, configurable replay/buffer | Multicast signals where every active collector should observe the value |
| Cold `Flow` | Starts on collect | Repository streams, Room |
| `LiveData` | Lifecycle-aware holder | Legacy / simple UI |

```kotlin
private val _uiState = MutableStateFlow(LoginUiState())
val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

fun onEmail(value: String) {
    _uiState.update { it.copy(email = value) }
}
```

Room can expose `Flow<List<Entity>>` that emits on DB changes - excellent as a local source of truth when combined with network refresh.

## Collecting in Android UI

```kotlin
// Fragment / Activity
viewLifecycleOwner.lifecycleScope.launch {
    viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.uiState.collect { render(it) }
    }
}

// Compose
val state by viewModel.uiState.collectAsStateWithLifecycle()
```

Avoid:

```kotlin
lifecycleScope.launch {
    viewModel.uiState.collect { render(it) } // keeps collecting when STOPPED
}
```

## UI consequences belong in state

Do not treat a `Channel` or `SharedFlow` emitted by a ViewModel as a default delivery mechanism for navigation or snackbars. A collector can be absent while the UI is stopped, and buffering policy then becomes accidental product behavior. An event that changes what the user should be able to see or do should be processed in the ViewModel and represented by the resulting state.

```kotlin
data class CheckoutUiState(
    val submission: Submission = Submission.Editing,
)

sealed interface Submission {
    data object Editing : Submission
    data object Submitting : Submission
    data class Confirmed(val orderId: String) : Submission
    data class Failed(val message: String) : Submission
}
```

The UI renders `Confirmed` as a confirmation destination and `Failed` as a retryable message. If the effect is truly transient, define its acknowledgement and replay behavior explicitly. Never rely on an incidental buffer to decide whether a user sees an important outcome.

## Work that must survive the screen

If the user leaves the screen but the write must complete:

- **Not** a fire-and-forget `viewModelScope` without care (cleared on leave).
- Prefer **WorkManager** for deferrable, guaranteed, constraint-aware work.
- Or an application-scoped repository scope with explicit policy (and tests).

Mid-level judgment: *does cancellation on leave match product expectations?*

## Common pitfalls

1. **`GlobalScope.launch`** - no ownership, hard cancellation, leaky.
2. **Swallowing `CancellationException`.**
3. **Blocking the main thread** inside a coroutine without `withContext`.
4. **`async` without structured scope** (`GlobalScope.async`) - orphaned work.
5. **Collecting StateFlow without lifecycle** - wasted work, subtle bugs.
6. **`stateIn` with `Eagerly` everywhere** - work runs with no subscribers; know `WhileSubscribed`.

## Examination prompts

- “Why not GlobalScope?”
- “Difference between `launch` and `async`?”
- “What happens if you cancel a parent job?”
- “Cold vs hot Flow?”
- “How do you implement search-as-you-type?”
- “Where do you catch errors - repository, ViewModel, or UI?”
- Output-tracing questions with `async` + delays + cancellation.

## Practice checklist

1. Implement refresh in a ViewModel with Loading/Content/Error and cancellation-safe error handling.
2. Build debounced search with `flatMapLatest`.
3. Unit-test the ViewModel with `runTest` and a fake repository.
4. Replace a `Thread` / `AsyncTask` mental model explanation with scopes and dispatchers in your own words.

## What you should be able to explain

- Scope ownership and structured concurrency.
- Dispatcher choice and `withContext`.
- Cancellation rules and `CancellationException`.
- Flow pipeline for UI data and lifecycle-safe collection.

Next: **Compose state, recomposition, and side effects** - how declarative UI consumes the state you just learned to produce.
