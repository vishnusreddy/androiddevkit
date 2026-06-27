---
question: "What should an Android app's testing strategy look like?"
topic: testing-quality
difficulty: junior
tags: ["testing", "test-pyramid", "quality"]
---

The **test pyramid** guides where to invest: many fast tests at the bottom, few slow ones at the top.

```
        /\        UI / E2E tests  (few - slow, brittle, on-device)
       /  \       Espresso / Compose UI tests, full flows
      /----\      Integration tests (some)
     /      \     Room DAO, repository + fakes, navigation
    /--------\    Unit tests (many - fast, JVM)
   /__________\   ViewModels, use cases, mappers, pure logic
```

**Unit tests (the base, most of your tests):**
- Run on the **JVM** (no device) → fast, run on every change.
- Target **pure logic**: ViewModels, use cases, mappers, formatters, repositories (with fake data sources).
- Use `runTest` for coroutines, **inject dispatchers**, Turbine for flows.

**Integration tests (middle):**
- Verify components **together**: Room DAOs against an in-memory DB, a repository with real DB + fake network, navigation graphs.
- Some run on JVM (Robolectric) or instrumented.

**UI / End-to-end (top, few):**
- **Espresso** (Views) / **Compose UI tests** / **UI Automator** drive real screens and flows.
- Slow and flakier, so cover **critical user journeys** (login, checkout), not every screen.

**What makes the app testable (the real point):**
- **Architecture enables testing** - DI + interfaces let you inject fakes; UDF makes ViewModels pure functions of input you can assert on; separating layers keeps logic Android-free.
- **Inject dispatchers** and clocks so time/threading is controllable.
- Prefer **fakes over heavy mocking**, and test **behavior, not implementation**.

**Other tools:** screenshot tests (Paparazzi/Roborazzi) for visual regression, `Macrobenchmark` for performance, and Play **Pre-launch reports** for device coverage.
