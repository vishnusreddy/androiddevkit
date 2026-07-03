---
question: "How do you test configuration changes and process-death restoration?"
topic: testing-quality
difficulty: senior
order: 30
starred: true
section: "UI and navigation"
tags: ["testing", "process-death", "savedstatehandle", "remember-saveable"]
---

Rotation and process death are different failures and need different tests.

**Configuration change:** `ActivityScenario.recreate()` or host recreation can
verify that the ViewModel survives, the UI is rebuilt, collectors do not
duplicate, and transient UI state behaves as intended. This does **not** simulate
process death because the same process and retained state can remain available.

**Saveable Compose state:** `StateRestorationTester` can emulate saving and
restoring the hierarchy around a composable. Verify values backed by
`rememberSaveable` and custom `Saver` implementations.

**ViewModel restoration:** construct the ViewModel with a `SavedStateHandle`,
drive changes, capture the keys that are meant to survive, then create a new
ViewModel from restored values. Keep the saved data small and serializable.

**Real process recreation:** for a critical flow, use an instrumented or
device-level test that backgrounds the app, kills its process, and relaunches
through the supported entry point. Assert from user-visible state or durable
storage, not from object identity.

Test the product contract:

- Navigation identity, query text, or draft ID is restored.
- Durable edits come back from Room or another persistent source.
- Loading work is restarted safely and does not duplicate a submission.
- One-time events are not replayed merely because the screen was rebuilt.
- Sensitive or excessively large objects are not placed in saved state.

The key interview distinction is that a `ViewModel` handles configuration
changes, `SavedStateHandle` handles small restorable state, and persistent
storage handles durable user data.
