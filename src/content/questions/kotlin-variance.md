---
question: "Explain generics variance: in, out, and star projection."
topic: kotlin
difficulty: mid
tags: ["kotlin", "generics", "variance"]
---

Start with a practical rule: if a generic type only **produces** values, mark it
`out`. If it only **consumes** values, mark it `in`.

These rules are called variance. Without `in` or `out`, a generic type is
invariant: `Box<String>` cannot be used as `Box<Any>`, even though `String` is a
subtype of `Any`.

**`out` means producer.** The type is returned, not accepted as input. This is
why Kotlin's read-only `List` is `List<out T>`.
```kotlin
interface Producer<out T> { fun produce(): T }
val p: Producer<Any> = object : Producer<String> { ... }  // OK
```
Kotlin's read-only `List<out E>` is covariant - that's why `List<String>` *is* usable as `List<Any>`.

**`in` means consumer.** The type is accepted as input, not returned. A
`Comparator<Any>` can compare strings, so it can be used where a
`Comparator<String>` is required.
```kotlin
interface Consumer<in T> { fun consume(item: T) }
val c: Consumer<String> = object : Consumer<Any> { ... }  // OK
```

Mnemonic: **PECS / "in–consumer, out–producer."**

**Star projection `<*>`** - used when you don't know or care about the argument: a `Box<*>` is a `Box` of *some* type. You can read values as the upper bound (`Any?`) but can't safely write (except `null`), because the real type is unknown.

```kotlin
fun printAll(box: Box<*>) { println(box.get()) }  // get is fine, set isn't
```

`in`/`out` at the declaration site is **declaration-site variance**; specifying it at a usage point (`Array<out T>`) is **use-site variance** (Kotlin's equivalent of Java wildcards).
