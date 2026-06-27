---
question: "What is a UseCase (Interactor), and when do you actually need one?"
topic: architecture
difficulty: mid
tags: ["usecase", "domain-layer", "clean-architecture"]
---

A **UseCase** (a.k.a. Interactor) encapsulates a **single piece of business logic** in the domain layer. It typically depends on repositories and is consumed by ViewModels. Convention: name it as a verb and expose a single `invoke` operator.

```kotlin
class GetVisibleFeedUseCase(
    private val feedRepo: FeedRepository,
    private val settingsRepo: SettingsRepository,
) {
    operator fun invoke(): Flow<List<Post>> =
        combine(feedRepo.observeFeed(), settingsRepo.blockedAuthors()) { posts, blocked ->
            posts.filterNot { it.author in blocked }   // the business rule
        }
}

// In the ViewModel:
val feed = getVisibleFeed().stateIn(...)
```

**When you NEED one:**
- **Logic reused across multiple ViewModels** — put it in one place instead of duplicating.
- **Combining multiple repositories / non-trivial rules** — orchestration that doesn't belong in a repository (which does data access) or a ViewModel (which does UI state).
- **Complex domains** where you want pure, independently testable business logic with no Android deps.

**When you DON'T (the pragmatic point interviewers reward):**
- **Pass-through use cases** that just call `repository.getX()` add a layer for **no value** — boilerplate. If a ViewModel can call the repository directly with no extra logic, skip the use case.
- Simple CRUD apps rarely need a full domain layer.

**Design conventions:**
- **One use case = one responsibility** (single public method, often `operator fun invoke`).
- **No Android dependencies** — pure Kotlin, trivially unit-tested.
- Inject the **dispatcher** if it does CPU work (`withContext(defaultDispatcher)`), keeping it off the main thread and testable.

**Soundbite:** "A UseCase is a single, reusable, Android-free piece of business logic between ViewModel and repositories. Add one when logic is shared or combines sources; skip it when it'd just forward a single repository call."
