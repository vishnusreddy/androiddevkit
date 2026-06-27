---
question: "How does Hilt work? Explain components, scopes, modules, and bindings."
topic: architecture
difficulty: senior
tags: ["hilt", "dagger", "dependency-injection"]
---

**Hilt** is a DI framework built on **Dagger** that standardizes DI on Android with predefined **components** tied to Android lifecycles.

**Setup:** annotate the `Application` with `@HiltAndroidApp` (creates the app-level component), and inject into Android classes with `@AndroidEntryPoint`.

**Components & scopes** - Hilt generates a component hierarchy mirroring Android lifecycles; each has a scope annotation:

| Component | Scope | Lifetime |
|---|---|---|
| `SingletonComponent` | `@Singleton` | Application |
| `ActivityRetainedComponent` | `@ActivityRetainedScoped` | across config changes |
| `ViewModelComponent` | `@ViewModelScoped` | a ViewModel |
| `ActivityComponent` | `@ActivityScoped` | an Activity |
| `FragmentComponent` | `@FragmentScoped` | a Fragment |

A **scoped** binding returns the **same instance** within that component's lifetime; **unscoped** returns a new instance each request.

**Providing dependencies:**
- **Constructor injection** - `@Inject constructor(...)`; Hilt knows how to build it.
- **Modules** (`@Module @InstallIn(SomeComponent::class)`) - for types you can't annotate (interfaces, third-party classes):
```kotlin
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder()...build()
}
```
- **`@Binds`** - bind an **interface** to its implementation efficiently:
```kotlin
@Binds abstract fun bindRepo(impl: UserRepositoryImpl): UserRepository
```

**ViewModels:** annotate with `@HiltViewModel` + `@Inject constructor`; retrieve with `hiltViewModel()` (Compose) or `by viewModels()`.

**What to remember:**
- Hilt is **compile-time** and **type-safe** (Dagger codegen) - errors surface at build time, no reflection, good performance.
- **`@Qualifier`** disambiguates two bindings of the same type (`@AuthClient` vs `@PublicClient` OkHttp).
- **Assisted injection** (`@AssistedInject`) for objects needing both DI-provided and runtime params.
- Match scope to lifecycle - over-scoping (`@Singleton` everything) causes leaks/stale state; under-scoping recreates expensive objects.
