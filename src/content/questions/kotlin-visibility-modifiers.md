---
question: "What are Kotlin's visibility modifiers? What does internal mean?"
topic: kotlin
difficulty: junior
tags: ["kotlin", "visibility", "modules"]
---

Four modifiers, with `public` as the default:

- **`public`** (default) — visible everywhere.
- **`private`** — visible only within the file (top-level) or the enclosing class.
- **`protected`** — visible in the class and its subclasses (not top-level).
- **`internal`** — visible **everywhere in the same module**.

The interesting one is **`internal`**, which Java doesn't have. A *module* is a set of files compiled together — a Gradle module/source set, a Maven project, an IntelliJ module. `internal` is the backbone of **modularization**: a library module can expose a small `public` API while keeping implementation classes `internal` so other modules physically can't depend on them.

```kotlin
internal class HttpClientImpl   // usable across this module, invisible outside it
class FeatureApi {
    private val client = HttpClientImpl()
}
```

**Notes:**
- Kotlin has no package-private; `internal` (module) is the nearest equivalent and is broader than Java's package scope.
- `internal` names are mangled in the bytecode, which is why Java callers shouldn't rely on them.
- There's no default "open" — classes/members are `final` unless marked `open`.
