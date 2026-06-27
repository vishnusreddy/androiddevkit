---
question: "Service Locator vs Dependency Injection - what's the difference?"
topic: architecture
difficulty: senior
tags: ["dependency-injection", "service-locator"]
---

Both manage dependencies, but the **direction of control** differs.

**Dependency Injection** - dependencies are **pushed in** from outside (usually the constructor). The class declares what it needs and receives it; it never asks for anything.
```kotlin
class FeedViewModel(private val repo: FeedRepository)   // dependencies are explicit
```

**Service Locator** - the class **pulls** dependencies from a central registry on demand.
```kotlin
class FeedViewModel {
    private val repo = ServiceLocator.get<FeedRepository>()   // class asks the locator
}
```

**Why DI is generally preferred:**
- **Explicit dependencies** - the constructor signature documents exactly what the class needs. A service locator **hides** dependencies inside the body, so you can't tell what a class requires without reading its implementation.
- **Testability** - with DI you just pass a fake in the constructor. With a locator you must configure global state before each test (and reset it after), which is brittle and order-dependent.
- **Compile-time safety** - frameworks like Dagger/Hilt verify the graph at build time; a locator typically fails at **runtime** when a dependency is missing.
- **No hidden global state** - the locator is global mutable state, with all the coupling/testing problems that implies.

**Where it's nuanced:**
- **Koin** is technically closer to a **service locator** (you call `get()`/`by inject()`), though it presents a DI-like DSL - that's a common interview "gotcha."
- Service locators are simpler to set up and can be pragmatic for small apps or to bootstrap before a full DI framework.
