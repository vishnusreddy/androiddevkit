---
question: "What are common Android architecture anti-patterns?"
topic: architecture
difficulty: mid
tags: ["anti-patterns", "code-smells", "clean-code"]
---

The ones interviewers love to hear you call out:

**God Activity/Fragment** — an Activity doing UI, networking, persistence, and business logic. Violates SRP, untestable, unmaintainable. *Fix:* move logic to ViewModel/use cases/repositories; keep the UI thin.

**God ViewModel** — a 1000-line ViewModel handling many unrelated features. *Fix:* split by responsibility, extract use cases.

**Leaking Context/View** in singletons, ViewModels, static fields, or long-running coroutines. *Fix:* app context only, lifecycle scoping, weak refs.

**Business logic in the UI** — validation, formatting, or decisions in composables/Activities. *Fix:* push into ViewModel/domain; keep UI a function of state.

**Mutable shared state without a single source of truth** — multiple components caching/mutating the same data, drifting out of sync. *Fix:* one owner (repository/DB), observe it.

**Two-way / circular data flow** — UI mutating ViewModel state directly, or ViewModel referencing the View. *Fix:* UDF (state down, events up); expose read-only state.

**Overusing `GlobalScope`** — unscoped coroutines that leak and aren't cancelled. *Fix:* lifecycle scopes.

**Event bus everywhere** (`EventBus`, `LocalBroadcastManager`) — implicit, hard-to-trace global messaging. *Fix:* explicit `Flow`/callbacks, scoped state.

**Over-engineering** — three model layers + a use case per trivial call + five modules for a tiny app. *Fix:* match architecture to complexity; YAGNI.

**Stringly-typed everything** — string keys for navigation/args, magic strings. *Fix:* type-safe routes, sealed types, constants.

**Mock-heavy tests** mirroring implementation — brittle, break on refactor. *Fix:* prefer fakes, test behavior.

**The meta-point:** most anti-patterns are violations of **separation of concerns**, **single source of truth**, **UDF**, or **lifecycle correctness** — or the opposite sin, **over-engineering**. Naming the underlying principle is what impresses.

**Soundbite:** "God classes, leaking context, logic in the UI, no single source of truth, two-way data flow, GlobalScope, event buses, stringly-typed code, and brittle mock tests — plus over-engineering. They're all violations of separation of concerns/UDF/lifecycle correctness, or YAGNI gone the other way."
