---
question: "Describe Google's recommended app architecture."
topic: architecture
difficulty: mid
tags: ["architecture", "google-guidance", "layers"]
---

Google's official guidance defines **two-to-three layers** with **UDF** between them and a few firm principles.

**Layers:**
- **UI layer** — `ViewModel` + UI (Compose/Views). The ViewModel holds **`UiState`** and exposes it as an observable stream; the UI renders it and sends events up.
- **Domain layer (optional)** — **use cases** for reusable/complex business logic, sitting between UI and data.
- **Data layer** — **repositories** (the public API of the layer) over **data sources** (network, DB, DataStore). Repositories own the **single source of truth** and the data policy.

```
UI (ViewModel + Compose)  ──▶  Domain (UseCases)  ──▶  Data (Repository → sources)
        ▲────────────────── state flows back ──────────────────┘
```

**The core principles Google emphasizes:**
1. **Separation of concerns** — UI is thin; logic lives in ViewModel/domain/data, not Activities/Fragments.
2. **Drive UI from data models** — ideally immutable, observable state; **UDF** (state down, events up).
3. **Single source of truth** — each data type has one owner (usually the repository/DB) that others read; mutations go through it.
4. **Unidirectional data flow** — events flow up, state flows down.

**Practical specifics:**
- ViewModel exposes `StateFlow<UiState>`, often via `stateIn(WhileSubscribed(5000))`.
- Repository exposes `Flow`s; DB (Room) is the source of truth for offline-first.
- Dependencies injected (Hilt); each layer testable in isolation.
- Scale up with **modularization** (feature + core modules) as in **Now in Android**.

**Pragmatism:** the **domain layer is optional** — add it when logic is shared or complex; ViewModel → Repository is fine otherwise. Don't over-engineer simple screens.

**Soundbite:** "UI (ViewModel + state) → optional Domain (use cases) → Data (repository over sources), connected by UDF, with separation of concerns, a single source of truth, and DI. Add the domain layer and modularization as complexity grows."
