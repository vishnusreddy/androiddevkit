---
question: "How do you choose the right dependency injection scope?"
topic: architecture
difficulty: senior
tags: ["dependency-injection", "hilt", "scoping"]
---

A **scope** controls how long a single instance lives and how widely it's shared. With Hilt:

| Scope | One instance per | Use for |
|---|---|---|
| `@Singleton` | application | DB, Retrofit, OkHttp, app-wide repos |
| `@ActivityRetainedScoped` | survives config change | shared across an Activity + its ViewModels |
| `@ViewModelScoped` | a ViewModel | use cases/helpers tied to one screen's VM |
| `@ActivityScoped` | an Activity | Activity-bound helpers |
| `@FragmentScoped` | a Fragment | fragment-bound helpers |
| *(unscoped)* | every injection | stateless, cheap objects |

**Matching scope to lifetime is the whole game:**

**Over-scoping** (e.g. `@Singleton` on everything):
- **Memory leaks / bloat** - objects live forever even when only needed briefly.
- **Stale state** - a singleton holding screen-specific or user-specific state persists across screens/logins when it shouldn't (e.g. caching the wrong user's data after re-login).
- **Hidden coupling** and harder reasoning about lifecycle.

**Under-scoping** (unscoped where you needed sharing):
- **Multiple instances** when you expected one - e.g. two ViewModels each get a *different* "session cache," so they don't share data.
- **Wasted work** - recreating expensive objects (an OkHttp client) on every injection.

**Guidance:**
- **Expensive, stateless, app-wide** (network/DB clients) → `@Singleton`.
- **Stateless, cheap** → leave **unscoped** (a new instance is fine and avoids retention).
- **State tied to a lifecycle** → scope to that lifecycle (`@ViewModelScoped`, `@ActivityRetainedScoped`).
- **User/session state** → a custom scope or a singleton you **explicitly clear** on logout (otherwise it leaks the previous session).
