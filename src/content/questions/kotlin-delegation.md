---
question: "How does delegation with the by keyword work in Kotlin?"
topic: kotlin
difficulty: mid
tags: ["kotlin", "delegation", "by"]
---

`by` lets one object hand off work to another, with compiler-generated plumbing. Two flavors:

**1. Class delegation** - implement an interface by forwarding to an instance, instead of inheritance.
```kotlin
interface Repo { fun load(): String }
class NetworkRepo : Repo { override fun load() = "net" }

// CachingRepo implements Repo by delegating to `delegate`,
// overriding only what it needs.
class CachingRepo(delegate: Repo) : Repo by delegate {
    override fun load() = cache ?: super.load()  // override selectively
}
```
This is composition over inheritance, with no boilerplate forwarding methods.

**2. Property delegation** - a property's get/set is delegated to an object that provides `getValue`/`setValue`.
```kotlin
val lazyValue: String by lazy { compute() }          // stdlib delegate
var name: String by Delegates.observable("") { _, old, new -> log(old, new) }
val token: String by preferences                      // custom delegate
```

Built-in delegates: `lazy`, `Delegates.observable`/`vetoable`, `Delegates.notNull`, and **map-backed** properties (`val name: String by map`). Compose's `by remember { mutableStateOf(...) }` is property delegation too.

**Write your own** by implementing `operator fun getValue(thisRef, property)` (and `setValue` for `var`), or `ReadOnlyProperty`/`ReadWriteProperty`. Great for things like SharedPreferences-backed properties.
