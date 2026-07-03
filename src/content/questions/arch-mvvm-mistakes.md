---
question: "What are the most common MVVM mistakes in Android apps?"
topic: architecture
difficulty: mid
order: 95
starred: false
section: "Presentation and state"
tags: ["mvvm", "anti-patterns", "viewmodel", "state", "lifecycle"]
---

Common MVVM failures come from unclear ownership, not from the acronym itself.

- **God ViewModel:** it performs network calls, SQL, mapping, validation,
  analytics, and navigation. Move data policy to repositories and extract
  reusable or substantial rules when that creates a meaningful boundary.
- **UI objects in the ViewModel:** storing an Activity, Fragment, View,
  `NavController`, or Activity context creates leaks and mixes lifetimes.
- **Many unrelated observable fields:** loading, data, and error can emit in
  impossible combinations. Prefer a coherent immutable `UiState` when values
  describe one screen state.
- **Exposing mutable state:** the UI can bypass the ViewModel and create a second
  writer. Keep mutable flows private.
- **Cold Flow recreated by a getter:** every access builds a new pipeline and may
  repeat expensive work. Build the stream once and share it with an explicit
  lifetime when needed.
- **Network response as UI truth:** the screen becomes inconsistent with local
  writes or cached data. Let the repository define a source of truth.
- **Fire-and-forget navigation events:** a zero-replay stream can lose them while
  the UI is stopped. Represent business outcomes as state and define
  acknowledgement or durability where required.
- **Collecting without lifecycle awareness:** work continues while the screen is
  stopped or multiple collectors are created accidentally.
- **Using ViewModel as process storage:** it survives rotation, not process
  death. Persist durable state and save only small restorable inputs.
- **A repository interface for every class:** testability comes from useful
  seams, not an automatic interface plus implementation pair.

When reviewing an MVVM feature, trace one user action from the UI to the data
owner and back to rendered state. At every step, ask who can write the value,
which lifetime owns it, and what happens after failure or recreation.
