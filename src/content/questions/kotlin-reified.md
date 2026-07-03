---
question: "What is a reified type parameter and why do you need inline for it?"
topic: kotlin
difficulty: mid
order: 170
starred: true
section: "Functions and idioms"
tags: ["kotlin", "generics", "reified", "inline"]
---

On the JVM, generic arguments are normally **erased**: at runtime
`List<String>` and `List<Int>` are both `List`, and a regular generic function
cannot use `T::class` or test `value is T`. A **`reified`** parameter lets the
body of an inline function use the concrete call-site type in supported
operations.

It only works on inline functions because the compiler substitutes the
concrete type while expanding each call. It does not disable JVM type erasure
for `T` everywhere—for example, `is List<T>` still cannot verify a list's erased
element type.

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
