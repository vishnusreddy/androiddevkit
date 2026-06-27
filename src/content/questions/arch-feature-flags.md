---
question: "How would you architect feature flags / remote config?"
topic: architecture
difficulty: mid
tags: ["feature-flags", "remote-config", "architecture"]
---

Feature flags let you toggle features without shipping a new build — for gradual rollouts, A/B tests, kill switches, and per-segment targeting.

**Architecture — wrap the source behind your own abstraction:**
```kotlin
interface FeatureFlags {
    fun isEnabled(flag: Flag): Boolean
    fun <T> value(flag: Flag, default: T): T
}

enum class Flag(val key: String, val default: Boolean) {
    NEW_CHECKOUT("new_checkout", false),
    DARK_MODE_V2("dark_mode_v2", false),
}
```
Implement it over **Firebase Remote Config** (or LaunchDarkly, Statsig, your own backend). The rest of the app depends on the `FeatureFlags` **interface**, not the vendor SDK.

**Why the abstraction matters:**
- **Decoupling / swappability** — switch providers without touching feature code (anti-corruption layer).
- **Testability** — inject a fake `FeatureFlags` to test both branches.
- **Type safety** — an `enum`/sealed set of flags beats scattered magic strings.

**Design considerations interviewers want:**
- **Fetch & cache** — remote config is fetched async and cached locally; provide **sensible defaults** so the app works on first launch / offline. Don't block startup on a fetch.
- **Consistency within a session** — usually snapshot values at app start / screen entry so a flag doesn't flip mid-flow; apply new values on next launch.
- **Kill switch** — flags let you disable a broken feature server-side without a release — pair with a **forced refresh** for emergencies.
- **Clean up stale flags** — old flags rot; track and remove them.
- **A/B testing** — flags carry experiment assignments; log exposure to analytics for analysis.
- **Layering** — the flag check usually lives in the **domain/data** layer (or a config module), surfaced to the UI via state, not scattered `if` checks everywhere.

**Soundbite:** "Wrap the remote-config provider behind a typed `FeatureFlags` interface with safe defaults and local caching — decoupled, testable, swappable. Snapshot values per session, support kill switches and A/B exposure logging, and prune stale flags."
