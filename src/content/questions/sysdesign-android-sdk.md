---
question: "Design a reusable Android SDK that other apps can integrate safely."
topic: system-design
difficulty: senior
order: 15
starred: true
section: "SDK and library design"
tags: ["system-design", "sdk", "api-design", "compatibility", "performance"]
---

An SDK is a long-lived contract inside another team's process. Optimize for a
small API, safe defaults, compatibility, isolation, and diagnosability.

**Clarify the contract:** supported Android API levels, Kotlin and Java callers,
UI or headless use, initialization needs, process model, privacy requirements,
offline behavior, expected call volume, and whether the SDK talks to your
backend.

**Public API:** expose a narrow facade and immutable models. Prefer a builder or
configuration object for optional settings, suspend functions for one-shot work,
and `Flow` or callbacks for ongoing state. Document threading, cancellation,
errors, and lifecycle ownership. Do not leak internal Retrofit, Room, coroutine,
or Compose types unless they are intentionally part of the contract.

```kotlin
interface PlacesSdk {
    suspend fun search(query: String, options: SearchOptions): SearchResult
    fun suggestions(query: StateFlow<String>): Flow<List<Suggestion>>
    fun close()
}
```

**Internals:** keep networking, cache, persistence, and telemetry behind the
facade. Namespace resources and manifest entries, minimize transitive
dependencies, avoid global mutable state, and never retain an Activity. Heavy
initialization should be lazy and off the startup critical path.

**Reliability and resources:** deduplicate requests, bound queues and caches,
honor cancellation, back off retries, work offline where required, and handle
multiple SDK instances or processes explicitly. Any background work must follow
Android restrictions and host-app expectations.

**Compatibility:** use semantic versioning, deprecate before removal, provide
migration notes, and test binary as well as source compatibility. Make server
protocols backward compatible because old app versions remain in the wild.

**Security and privacy:** collect the minimum data, require consent where needed,
encrypt sensitive local data, keep secrets out of the AAR, and provide deletion
or reset APIs.

**Quality:** ship a sample app, API reference, integration tests, fake or test
mode, ProGuard consumer rules, and actionable diagnostics that redact sensitive
data. Measure SDK startup cost, size, memory, battery, failure rate, and latency
separately from the host app.

The central trade-off is convenience versus control. Automatic initialization
and hidden behavior make integration easy, but surprise the host and are harder
to debug. Prefer explicit behavior for anything costly or privacy-sensitive.
