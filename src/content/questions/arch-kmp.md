---
question: "How do you architect a Kotlin Multiplatform (KMP) app? What's shared and what isn't?"
topic: architecture
difficulty: senior
tags: ["kmp", "multiplatform", "architecture"]
---

**Kotlin Multiplatform** lets you share **business logic** across Android, iOS (and more) while keeping **UI native** (or shared via Compose Multiplatform).

**What's typically shared (commonMain):**
- **Data layer** — repositories, networking (**Ktor**), local storage (**SQLDelight** / Room KMP), DTOs, mappers.
- **Domain layer** — use cases, business rules, domain models.
- **Presentation logic** — ViewModels/state holders (with libraries like **Decompose**, **Voyager**, or KMP-ViewModel) and `StateFlow`-based state.
- Shared **coroutines/Flow** code, serialization (kotlinx.serialization).

**What stays platform-specific:**
- **UI** — Jetpack Compose on Android, SwiftUI on iOS (or **Compose Multiplatform** to share UI too).
- **Platform APIs** — camera, sensors, permissions, push, secure storage — accessed via the **`expect`/`actual`** mechanism.

```kotlin
// commonMain
expect class PlatformContext
expect fun httpClientEngine(): HttpClientEngine

// androidMain / iosMain provide the `actual` implementations
```

**Key architecture decisions interviewers probe:**
- **`expect`/`actual`** for platform differences — declare the contract in common, implement per platform.
- **Source sets** — `commonMain`, `androidMain`, `iosMain`; common code can't touch Android/iOS APIs directly.
- **DI** — Koin is popular for KMP (Hilt is Android-only); or constructor DI in common code.
- **How much to share** — sharing the **data + domain + presentation** layers maximizes reuse with the least friction; sharing **UI** (Compose Multiplatform) is increasingly viable but more involved on iOS.
- **iOS interop** — shared code is exposed to Swift via an Obj-C/Swift framework; `suspend`/`Flow` need bridging (`SKIE`, callbacks) for ergonomic Swift consumption.

**Trade-offs:** shared logic and consistency vs. tooling maturity, iOS interop friction, and a steeper build setup. Sweet spot for many teams: **share logic, keep UI native**.

**Soundbite:** "KMP shares data/domain/presentation logic via `commonMain` and `expect`/`actual` for platform APIs, while UI stays native (or Compose Multiplatform). Use Ktor/SQLDelight/Koin; the common pattern is share-the-logic, keep-UI-native, weighing reuse against iOS interop and tooling maturity."
