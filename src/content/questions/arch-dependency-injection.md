---
question: "What is dependency injection, and why use it on Android?"
topic: architecture
difficulty: mid
tags: ["dependency-injection", "testability"]
---

**Dependency injection (DI)** means a class **receives** its dependencies from outside rather than **creating** them itself. "Inversion of control" — something else (a framework or the caller) is responsible for constructing and wiring objects.

```kotlin
// ❌ Without DI: class creates and is coupled to concrete dependencies
class UserViewModel {
    private val repo = UserRepository(RetrofitClient.create(), AppDatabase.dao())
}

// ✅ With DI: dependencies injected; class depends on abstractions
class UserViewModel(private val repo: UserRepository)
```

**Why it matters:**
- **Testability** — inject a **fake/mock** repository in tests instead of hitting the real network/DB. This is the #1 reason.
- **Decoupling** — a class depends on an **interface**, not a concrete implementation; swap implementations (debug vs prod, different backends) without changing the class.
- **Single responsibility** — classes focus on *using* dependencies, not *constructing* them (and their dependencies, and *their* dependencies…).
- **Lifecycle & scoping** — a DI framework can provide singletons, per-Activity, or per-ViewModel instances correctly.

**On Android specifically:**
- Manual DI works but becomes painful as the graph grows (constructing a ViewModel might require a repo, which needs an API, a DB, an OkHttp client, …).
- **Hilt** (built on Dagger) generates this wiring at **compile time** — type-safe, no reflection — and integrates with Android components (Activity, ViewModel, WorkManager).
- **Koin** is a lighter, runtime **service locator**-style alternative (simpler, but resolution errors surface at runtime).

**Forms of DI:** **constructor** injection (preferred — explicit, testable), **field** injection (for framework-created objects like Activities), and **method** injection.

**Soundbite:** "DI gives a class its dependencies instead of letting it build them — decoupling code from concrete implementations and making it testable. On Android, Hilt generates the wiring at compile time; manual DI works but doesn't scale to large graphs."
