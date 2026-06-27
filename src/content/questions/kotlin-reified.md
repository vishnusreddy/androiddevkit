---
question: "What is a reified type parameter and why do you need inline for it?"
topic: kotlin
difficulty: mid
order: 170
starred: true
section: "Functions and idioms"
tags: ["kotlin", "generics", "reified", "inline"]
---

On the JVM generics are **erased** - at runtime `List<String>` and `List<Int>` are both just `List`, and a normal generic function can't ask `T::class` or do `is T`. A **`reified`** type parameter keeps the concrete type available at runtime.

It only works with `inline` functions: because the function is inlined at the call site, the compiler substitutes the *real* type there, so the type information survives.

```kotlin
inline fun <reified T> Gson.fromJson(json: String): T =
    fromJson(json, T::class.java)

inline fun <reified T> List<*>.filterIsType(): List<T> =
    filterIsInstance<T>()        // uses `is T` under the hood

// Android: a clean startActivity helper
inline fun <reified T : Activity> Context.start() =
    startActivity(Intent(this, T::class.java))

context.start<DetailActivity>()
```

**Why it matters:** it removes the need to pass `Class<T>` parameters around (`fromJson(json, Foo::class.java)` becomes `fromJson<Foo>(json)`), which is why Gson/Moshi extensions, DI lookups, and intent builders use it everywhere.

**Limitation to mention:** because it relies on inlining, a `reified` type can't be used from Java, and you can't call it where `T` is itself a non-reified generic.
