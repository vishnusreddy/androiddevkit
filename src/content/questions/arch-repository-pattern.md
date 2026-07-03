---
question: "What is the Repository pattern, and what problem does it solve?"
topic: architecture
difficulty: junior
order: 20
starred: true
section: "Architecture foundations"
tags: ["repository", "data-layer", "abstraction"]
---

A **Repository** is the public entry point to a type of application data. It
coordinates data sources such as network, Room, DataStore, sensors, or memory,
and owns the policy for reading, refreshing, and mutating that data.

```kotlin
class UserRepository(
    private val api: UserApi,
    private val dao: UserDao,
) {
    fun observeUser(id: String): Flow<User> =
        dao.observe(id).map { it.toModel() }

    suspend fun refreshUser(id: String) {
        val remote = api.fetch(id)
        dao.upsert(remote.toEntity())
    }
}
```

**What it solves:**
- **Single source of truth** - the repository identifies the authoritative source
  for the data it exposes. Offline-first data commonly comes from Room, while a
  login session might be owned by memory plus secure persistent storage.
- **Abstraction** - ViewModels depend on the repository, not on Retrofit or Room. Swapping the network library or adding a cache doesn't ripple into the UI.
- **Testability** - a ViewModel test can use a fake repository; a repository test
  can use controlled data sources.
- **Centralized data policy** - mapping, refresh, conflict resolution, and offline
  behavior do not leak into every ViewModel.

**Design choices:**
- Repositories expose models that make sense to their consumers and keep
  data-source types such as DTOs or entities private.
- An interface is useful when it creates a real boundary, supports multiple
  implementations, or allows a consumer module to avoid the implementation.
  Do not create one mechanically for every class.
- One repository per **data type/feature** (UserRepository, FeedRepository), not one giant "DataRepository."
- The data layer owns business rules about its data, such as freshness and
  conflict resolution. Cross-repository or presentation-specific rules may fit a
  use case or state holder instead.
