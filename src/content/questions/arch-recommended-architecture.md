---
question: "Describe Google's recommended app architecture."
topic: architecture
difficulty: mid
order: 10
starred: true
section: "Architecture foundations"
tags: ["architecture", "google-guidance", "layers"]
---

Google's current guidance starts with **at least two layers** and adds a third
only when it earns its place.

**Layers:**
- **UI layer** - UI elements plus state holders such as `ViewModel`. The UI
  renders observable state and relays user actions. UI-specific logic can stay
  close to the UI; application data and business rules should not live in an
  Activity, Fragment, or composable.
- **Data layer** - repositories expose application data and coordinate data
  sources such as network, Room, DataStore, Bluetooth, or location. Each
  repository defines a single source of truth and is main-safe.
- **Domain layer (optional)** - use cases simplify complex ViewModels or reuse
  business logic across multiple consumers. It is useful in larger apps, not a
  required wrapper around every repository method.

![Recommended Android architecture with UI, optional domain, repositories, and data sources](/diagrams/recommended-architecture.svg)

**The core principles Google emphasizes:**
1. **Separation of concerns** - responsibilities follow ownership and lifetime.
2. **Drive UI from data models** - expose immutable state and use
   unidirectional data flow: state down, events up.
3. **Single source of truth** - the owner of a data type is the only place that
   mutates it. For offline-first data this is often Room, but it can also be a
   network or in-memory source.
4. **Coroutines and Flow between layers** - expose observable streams and make
   blocking work safe to call from the main thread.

**Practical specifics:**
- A ViewModel commonly exposes `StateFlow<UiState>` and collects repository data.
- Room can be the source of truth for offline-first data, with network refreshes
  updating Room instead of bypassing it.
- Dependency injection keeps construction separate and lets tests provide fakes.
- Modularization is a scaling tool, not a requirement for a small app.

This is guidance, not a fixed folder template. A direct ViewModel-to-repository
dependency is valid. Add layers and abstractions in response to complexity,
reuse, ownership, or team boundaries.
