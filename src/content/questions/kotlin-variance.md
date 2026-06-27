---
question: "Explain generics variance: in, out, and star projection."
topic: kotlin
difficulty: senior
tags: ["kotlin", "generics", "variance"]
---

Variance describes how generic types relate when their type arguments are subtypes. By default Kotlin generics are **invariant**: `List<String>` is *not* a `List<Any>` even though `String : Any`.

**`out` (covariance) — a producer.** The type only appears in *output* positions (return types). `out T` means you can use a `Box<String>` where a `Box<Any>` is expected.
```kotlin
interface Producer<out T> { fun produce(): T }
val p: Producer<Any> = object : Producer<String> { ... }  // OK
```
Kotlin's read-only `List<out E>` is covariant — that's why `List<String>` *is* usable as `List<Any>`.

**`in` (contravariance) — a consumer.** The type only appears in *input* positions (parameters). `in T` means a `Comparator<Any>` works where a `Comparator<String>` is needed.
```kotlin
interface Consumer<in T> { fun consume(item: T) }
val c: Consumer<String> = object : Consumer<Any> { ... }  // OK
```

Mnemonic: **PECS / "in–consumer, out–producer."**

**Star projection `<*>`** — used when you don't know or care about the argument: a `Box<*>` is a `Box` of *some* type. You can read values as the upper bound (`Any?`) but can't safely write (except `null`), because the real type is unknown.

```kotlin
fun printAll(box: Box<*>) { println(box.get()) }  // get is fine, set isn't
```

`in`/`out` at the declaration site is **declaration-site variance**; specifying it at a usage point (`Array<out T>`) is **use-site variance** (Kotlin's equivalent of Java wildcards).
