---
question: "Fakes vs mocks vs stubs — which should you prefer and why?"
topic: architecture
difficulty: mid
tags: ["testing", "fakes", "mocks"]
---

All three are **test doubles** that stand in for real dependencies, but they differ:

- **Stub** — returns canned answers to calls (`whenever(repo.get()).thenReturn(data)`). No real behavior.
- **Mock** — a stub that also **verifies interactions** ("was `save()` called once with X?"). Created with frameworks like **MockK**/Mockito.
- **Fake** — a **real, working** lightweight implementation of the interface (e.g. an in-memory repository backed by a `MutableList`/`MutableStateFlow`).

```kotlin
// Fake: a real, simple implementation
class FakeUserRepository : UserRepository {
    private val users = MutableStateFlow<List<User>>(emptyList())
    override fun observeUsers() = users.asStateFlow()
    override suspend fun add(user: User) { users.update { it + user } }
}
```

**Prefer fakes (Google's guidance) because:**
- They test **behavior, not implementation** — you assert on the resulting **state**, not on "which methods were called." Mocks couple tests to internal call sequences, so refactors break tests even when behavior is unchanged ("brittle tests").
- A fake supports **realistic flows** (add then observe → emits the new list), which is exactly what `Flow`-based code needs. Mocking a `Flow`'s emissions over time is painful and error-prone.
- Fakes are **reusable** across many tests and read clearly.

**When mocks are still useful:**
- **Verifying an interaction *is* the requirement** — e.g. "analytics `track()` was called," "the repository's `sync()` was invoked." There's no state to assert, so verifying the call is legitimate.
- Simulating **errors/edge cases** that are awkward to build into a fake (a specific exception on the 3rd call).
- Quick isolation of a dependency you don't want to implement.

**Anti-pattern interviewers watch for:** mock-heavy tests that mirror the implementation line-by-line — they pass even when the code is wrong and break on every refactor.

**Soundbite:** "Prefer **fakes** — real lightweight implementations — so tests assert on behavior/state and survive refactors, especially for Flow-based code. Use **mocks** to verify interactions (analytics, sync) or force hard-to-fake errors. Avoid mock-everything tests that couple to implementation."
