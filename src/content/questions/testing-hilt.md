---
question: "How do you replace Hilt dependencies in Android tests?"
topic: testing-quality
difficulty: senior
order: 20
starred: false
section: "Data and network boundaries"
tags: ["testing", "hilt", "dependency-injection", "fakes"]
---

Use the production graph for wiring, but replace external boundaries with
deterministic test implementations.

For Hilt instrumented tests:

- Annotate the test with `@HiltAndroidTest`.
- Add `HiltAndroidRule` and call `inject()` after any rule that prepares the
  Activity or Compose host.
- Use the Hilt test application configured by the test runner.
- Replace a production module with `@TestInstallIn` when the fake should be
  shared by many tests.
- Use `@UninstallModules` for a one-off replacement, or `@BindValue` for a fake
  owned by one test class.

```kotlin
@Module
@TestInstallIn(
    components = [SingletonComponent::class],
    replaces = [NetworkModule::class],
)
object FakeNetworkModule {
    @Provides @Singleton
    fun api(): UserApi = FakeUserApi()
}
```

Replace the narrowest boundary that gives the test control. A UI integration
test may use the real ViewModel, repository, Room database, and navigation while
replacing only the remote API and clock. Replacing every class with a mock proves
very little about the graph.

Watch scope and state leakage. A singleton fake is shared for the component's
lifetime, so reset it between tests or provide a fresh graph. Also keep local
ViewModel and use-case tests independent of Hilt. DI-framework tests are useful
for graph integration, not for every branch of business logic.
