---
title: Kotlin foundations for Android
description: Learn the Kotlin language features you will use before Android framework code can make sense.
level: junior
order: 1
duration: 50 min
quizHref: /practice/?test=kotlin-test
quizLabel: Take the Kotlin quiz
---

Kotlin is not a warm-up before “real Android.” It is how you express state, handle missing data, and prevent entire categories of mistakes in Android code. Before learning Activities or Compose, become comfortable reading and writing small Kotlin models and functions until they feel automatic.

This lesson focuses on the language surface you will touch daily: null safety, `val`/`var`, data and sealed types, functions, collections, and scope functions. Internals like variance and reified generics matter later; they are not the first gate.

## Learning goals

By the end of this lesson you should be able to:

- Choose between `val` and `var`, and explain why immutability-by-default helps Android UI code.
- Handle nullable types with `?.`, `?:`, and smart casts - and know when `!!` is a smell.
- Model a screen’s data with `data class` and mutually exclusive outcomes with `sealed interface` / `sealed class`.
- Transform collections with `map`, `filter`, `firstOrNull`, and `associateBy` without hiding business rules.
- Pick a scope function (`let`, `also`, `apply`, `run`, `with`) for a clear purpose, or refuse one when it hurts readability.

## Values, variables, and nullability

### `val` vs `var`

Use `val` by default. A `val` reference cannot point at a different object after initialization, which makes ownership easier to reason about. The object itself may still be mutable (`val list = mutableListOf(...)`), so “`val` means immutable” is incomplete - it means the **binding** is fixed.

```kotlin
val userId: String = "u_42"          // binding fixed
var retryCount: Int = 0              // binding may change

val items = mutableListOf("a")       // list can grow
items += "b"                         // ok
// items = mutableListOf()           // error: val cannot be reassigned
```

`var` is appropriate when the **reference** must change: a counter, a swap, or a loop index. In Android UI state, prefer replacing whole immutable models (`state = state.copy(...)`) over mutating shared objects in place.

### Null is part of the type

Kotlin encodes nullability in the type system:

| Type | Meaning |
|------|---------|
| `String` | Non-null string |
| `String?` | String or null |
| Platform type `String!` (from Java) | Compiler cannot prove nullability |

```kotlin
fun displayName(user: User?): String {
    return user?.name?.trim().orEmpty()
}
```

- `?.` short-circuits to `null` if the receiver is null.
- `?:` (Elvis) supplies a fallback: `user?.name ?: "Guest"`.
- Smart casts: after `if (user != null)`, the compiler treats `user` as non-null inside that branch (for local `val`s and other stable cases).
- `!!` asserts non-null and throws `NullPointerException` if wrong. Treat it as an escape hatch, not a habit.

Empty string and null are different meanings. `orEmpty()` is honest when “no name → show blank” is product-correct. If a missing user is a real error, return an error UI state instead of silently hiding it:

```kotlin
fun titleFor(user: User?): String? =
    user?.name?.takeIf { it.isNotBlank() }
// null means “caller should show error / placeholder,” not "".
```

Prefer `requireNotNull(x) { "user must be loaded" }` when you need a hard invariant with a useful message.

### Platform types from Java

Android APIs and many libraries are Java. Kotlin sees their types as platform types (`String!`): neither nullable nor non-null. Null-check at the boundary, or use nullability annotations on Java code you own (`@Nullable` / `@NonNull`).

```kotlin
// Java API returns String! - treat carefully
val title = intent.getStringExtra("title") // String?
val safe = title.orEmpty()
```

## Model data deliberately

### Data classes for values

Use a `data class` for a value whose identity is its properties. You get useful `equals`, `hashCode`, `toString`, `copy`, and componentN for free. They are excellent UI models and domain models.

```kotlin
data class ProfileUiModel(
    val name: String,
    val isFollowing: Boolean,
    val followerCount: Int,
)

// Immutable update pattern
fun ProfileUiModel.toggledFollow(): ProfileUiModel =
    copy(
        isFollowing = !isFollowing,
        followerCount = followerCount + if (!isFollowing) 1 else -1,
    )
```

Avoid putting Android framework types (`Context`, `View`, `Bitmap`) inside data classes you pass across layers. Keep models pure Kotlin when you can.

### Sealed types for exclusive outcomes

When states are mutually exclusive, prefer a sealed type over a pile of booleans:

```kotlin
sealed interface ProfileState {
    data object Loading : ProfileState
    data class Content(val profile: ProfileUiModel) : ProfileState
    data class Error(val message: String, val canRetry: Boolean) : ProfileState
}

fun render(state: ProfileState): String = when (state) {
    is ProfileState.Loading -> "…"
    is ProfileState.Content -> state.profile.name
    is ProfileState.Error -> state.message
}
```

The compiler forces exhaustive `when` handling. Adding a new state becomes a compile-time checklist.

**Enum vs sealed:** use `enum class` for fixed labels without associated data (`Theme { LIGHT, DARK, SYSTEM }`). Use sealed types when branches carry different payloads (`Success(data)` vs `Error(throwable)`).

### Objects and companions

- `object` is a singleton - good for pure utilities or a shared default, bad as a dumping ground for mutable app state.
- `companion object` holds factory methods and constants related to a type.

```kotlin
data class UserId(val value: String) {
    companion object {
        fun parse(raw: String): UserId? =
            raw.trim().takeIf { it.isNotEmpty() }?.let(::UserId)
    }
}
```

## Functions, lambdas, and collections

### Prefer small, testable functions

A function with clear inputs and a return value is easier to test than one that reads and mutates many objects.

```kotlin
fun visibleTitles(articles: List<Article>, query: String): List<String> =
    articles
        .asSequence()
        .filter { it.isPublished }
        .map { it.title }
        .filter { query.isBlank() || it.contains(query, ignoreCase = true) }
        .toList()
```

Use `Sequence` when intermediate collections would be large and you only need a few results. For small lists, eager `List` operations are simpler and fine.

### Common operators you must read fluently

| Operator | Role |
|----------|------|
| `map` | Transform each element |
| `filter` | Keep matching elements |
| `firstOrNull` / `singleOrNull` | Safe lookups |
| `associateBy` / `groupBy` | Index by key |
| `flatMap` | Map then flatten |
| `fold` / `reduce` | Aggregate |

```kotlin
val byId = users.associateBy { it.id }
val admins = users.filter { it.role == Role.Admin }
val names = users.mapNotNull { it.displayName }
```

Do not hide complicated business rules in a 12-step chain “because it is short.” Extract a named function when the chain needs a comment.

### Higher-order functions and trailing lambdas

```kotlin
inline fun <T> measure(block: () -> T): T {
    val start = System.nanoTime()
    return block().also {
        println("took ${(System.nanoTime() - start) / 1_000_000}ms")
    }
}

val result = measure {
    loadArticles()
}
```

`inline` on small higher-order functions avoids allocating a lambda object and enables non-local `return` from the lambda. You will see this pattern everywhere in Kotlin stdlib and Compose.

## Scope functions without cargo-culting

| Function | Receiver | Returns | Typical use |
|----------|----------|---------|-------------|
| `let` | `it` | lambda result | Null-safe transform; map one value |
| `run` | `this` | lambda result | Compute with receiver |
| `with` | `this` (arg) | lambda result | Non-extension `run` |
| `apply` | `this` | receiver | Configure an object |
| `also` | `it` | receiver | Side effect (log, debug) |

```kotlin
val user = findUser(id)?.let { dto ->
    User(id = dto.id, name = dto.name.trim())
}

val intent = Intent(this, DetailActivity::class.java).apply {
    putExtra(EXTRA_ID, id)
}

repository.save(article).also { Log.d(TAG, "saved ${it.id}") }
```

If the receiver becomes ambiguous (`it` inside `it` inside `this`), use a normal named variable. Clarity beats cleverness in interview code and production code.

## Equality, when, and control flow

- `==` calls `equals` (structural for data classes).
- `===` is referential identity.
- `when` is an expression; prefer it over long `if/else` chains for sealed types and enums.

```kotlin
val label = when (val code = response.code) {
    in 200..299 -> "ok"
    401, 403 -> "auth"
    else -> "other:$code"
}
```

## Common junior pitfalls

1. **Using `!!` everywhere** after a null check that was not smart-cast-friendly (e.g. mutable properties). Capture to a local `val` or use `?.`.
2. **Mutable shared state** in singletons (`object`) that Activities and ViewModels race over.
3. **Data class with mutable lists** (`val items: MutableList<T>`) - equality and accidental mutation become painful; prefer `List` and `copy`.
4. **Boolean soup** for UI (`isLoading && !hasError && data != null`) instead of a sealed state.
5. **Scope-function noise** that makes a simple block unreadable under interview pressure.

## How interviewers probe this

Expect:

- “Difference between `val` and `var`?” - mention binding vs object mutability.
- “What does `!!` do?” - NPE at runtime; prefer safe operators.
- “When data class vs sealed class?” - values vs exclusive variants with payloads.
- “Output of this snippet?” - null chains, `let` vs `also` return values, collection ops.
- “How would you model loading / success / error?” - sealed interface, exhaustive `when`.

Strong answers name the **failure mode** (NPE, contradictory flags, accidental mutation) and the **replacement pattern**.

## Practice checklist

Before the next lesson, without notes:

1. Write `displayName(user: User?): String` three different ways (`?.`, `?:`, early return).
2. Model a login screen with a sealed state (idle, submitting, success, error).
3. Transform a list of network DTOs into UI models with `map` and drop invalid rows with `mapNotNull`.
4. Explain out loud when you would refuse a scope function.

## What you should be able to explain

- Nullable vs non-null types, and platform types from Java.
- `data class` vs regular class; sealed type vs enum.
- Why immutable UI models + `copy` beat scattered mutable fields.
- How to read a small collection pipeline without a debugger.

Next you will see how Android creates a window for your UI: the **Activity**.
