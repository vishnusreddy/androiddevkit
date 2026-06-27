---
question: "What are smart casts, and when do they fail to apply?"
topic: kotlin
difficulty: mid
order: 40
starred: false
section: "Language essentials"
tags: ["kotlin", "smart-cast", "null-safety"]
---

A **smart cast** is the compiler automatically casting a value after you've checked its type or nullability, so you don't write an explicit cast:

```kotlin
fun describe(x: Any) {
    if (x is String) {
        println(x.length)   // x smart-cast to String here
    }
}
```

It works after `is` checks, `!= null` checks, and on the matched branch of a `when`.

**When it fails - the classic interview point:** the compiler only smart-casts if it can *guarantee* the value didn't change between the check and the use. So it fails for:

- **`var` properties (especially of another class / open):** they could be modified by another thread or an overridden getter between check and use.
- **Custom getters:** a `val` with a custom getter could return a different value each call.
- **Properties from another module / mutable `var` globals.**

```kotlin
class Holder { var name: String? = null }
fun f(h: Holder) {
    if (h.name != null) {
        // println(h.name.length)  // ERROR: smart cast impossible (mutable var)
    }
}
```

**Fixes:** copy to a local `val` first (`val n = h.name; if (n != null) n.length`), or use `?.let { }`. Local `val`s and immutable properties smart-cast cleanly.
