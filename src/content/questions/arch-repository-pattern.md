---
question: "What is the Repository pattern, and what problem does it solve?"
topic: architecture
difficulty: mid
tags: ["repository", "data-layer", "abstraction"]
---

A **Repository** mediates between the rest of the app and the **data sources** (network, database, cache, DataStore). It exposes a clean, domain-oriented API and **hides where the data comes from**.

```kotlin
class UserRepository(
    private val api: UserApi,
    private val dao: UserDao,
) {
    // The caller doesn't know or care this comes from cache + network
    fun observeUser(id: String): Flow<User> = dao.observe(id)
        .onStart { refreshFromNetwork(id) }

    private suspend fun refreshFromNetwork(id: String) {
        runCatching { api.fetch(id) }.onSuccess { dao.upsert(it.toEntity()) }
    }
}
```

**What it solves:**
- **Single source of truth** — the repository decides the caching/refresh policy (e.g. DB as source of truth, network refreshes it). Callers just observe.
- **Abstraction** — ViewModels depend on the repository, not on Retrofit or Room. Swapping the network library or adding a cache doesn't ripple into the UI.
- **Testability** — fake the repository (or its data sources) in ViewModel tests.
- **Centralized logic** — retry, mapping DTO→domain, combining sources, and offline behavior live in one place, not scattered across ViewModels.

**Design points interviewers want:**
- Repositories typically expose **domain models**, mapping from **DTOs** (network) and **entities** (DB) at the boundary.
- Define the repository as an **interface** in the domain layer; implement it in the data layer (dependency inversion) so the domain doesn't depend on data details.
- One repository per **data type/feature** (UserRepository, FeedRepository), not one giant "DataRepository."
- Keep **business logic** out of the repository — it does data orchestration; complex rules belong in use cases.

**Soundbite:** "The Repository hides data sources behind a clean API, owns the single-source-of-truth/caching policy, and lets the rest of the app depend on an abstraction — so swapping or combining sources doesn't touch the UI."
