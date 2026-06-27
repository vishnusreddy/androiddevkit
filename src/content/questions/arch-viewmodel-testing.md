---
question: "How do you unit-test a ViewModel?"
topic: testing-quality
difficulty: mid
tags: ["testing", "viewmodel", "coroutines"]
---

A ViewModel is testable precisely because it's a **function of injected dependencies and input events → emitted state**. Inject a **fake repository**, drive events, assert on the emitted `UiState`.

```kotlin
class FeedViewModelTest {
    private val dispatcher = StandardTestDispatcher()

    @Before fun setup() { Dispatchers.setMain(dispatcher) }   // for viewModelScope
    @After  fun tearDown() { Dispatchers.resetMain() }

    @Test fun `loads feed successfully`() = runTest {
        val repo = FakeFeedRepository(items = listOf(post1, post2))
        val vm = FeedViewModel(repo)

        vm.state.test {                        // Turbine
            assertEquals(FeedUiState(loading = true), awaitItem())
            val loaded = awaitItem()
            assertEquals(listOf(post1, post2), loaded.items)
            assertFalse(loaded.loading)
        }
    }

    @Test fun `shows error when repo fails`() = runTest {
        val vm = FeedViewModel(FakeFeedRepository(error = IOException()))
        vm.refresh()
        advanceUntilIdle()
        assertNotNull(vm.state.value.errorMessage)
    }
}
```

**The essentials:**
- **`Dispatchers.setMain(testDispatcher)`** in setup - `viewModelScope` runs on `Dispatchers.Main`, which doesn't exist in unit tests; replace it. Reset in teardown.
- **`runTest`** gives a virtual clock (delays skipped) and `advanceUntilIdle()` to flush coroutines.
- **Inject dispatchers** into the ViewModel/repo rather than hardcoding `Dispatchers.IO`, so tests are deterministic.
- **Fake, don't hit real I/O** - a `FakeRepository` returning canned data/errors. Prefer fakes over mocking frameworks for state.
- **Assert on emitted state** with **Turbine** (`.test { awaitItem() }`) or by collecting into a list.
- Use **`InstantTaskExecutorRule`** if testing `LiveData`.

**What to test:** initial state, success path, error/empty paths, that events produce the right state transitions, and that one-off events are emitted.
