---
question: "How do you test coroutines and flows?"
topic: testing-quality
difficulty: senior
tags: ["coroutines", "testing", "runTest"]
---

The toolkit from `kotlinx-coroutines-test`:

**`runTest { }`** - the entry point for coroutine tests. It runs on a **virtual clock**, so `delay(10_000)` completes **instantly** (time is skipped, not waited). It also auto-waits for child coroutines.

```kotlin
@Test
fun loadsData() = runTest {
    val vm = MyViewModel(fakeRepo)
    vm.load()
    advanceUntilIdle()                 // run all pending coroutines
    assertEquals(Expected, vm.state.value)
}
```

**Test dispatchers:**
- **`StandardTestDispatcher`** - coroutines are queued, not run eagerly; you drive them with `advanceUntilIdle()` / `advanceTimeBy()`. Good for controlling ordering.
- **`UnconfinedTestDispatcher`** - runs coroutines eagerly to their first suspension. Simpler when you don't care about precise scheduling.

**Injecting the dispatcher** is the key design point: don't hardcode `Dispatchers.IO` - inject a dispatcher so tests can swap in a test one.
```kotlin
class Repo(private val io: CoroutineDispatcher = Dispatchers.IO) {
    suspend fun load() = withContext(io) { /* ... */ }
}
```

**Replacing `Dispatchers.Main`** (for `viewModelScope`): in setup call `Dispatchers.setMain(testDispatcher)`, and `Dispatchers.resetMain()` in teardown.

**Testing flows** - collect manually, or use **Turbine** for ergonomic assertions:
```kotlin
viewModel.state.test {           // Turbine
    assertEquals(Loading, awaitItem())
    assertEquals(Loaded(data), awaitItem())
    cancelAndIgnoreRemainingEvents()
}
```
