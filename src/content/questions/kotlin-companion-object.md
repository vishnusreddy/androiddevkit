---
question: "What is a companion object? Is it the same as Java's static?"
topic: kotlin
difficulty: junior
tags: ["kotlin", "companion-object", "static"]
---

Kotlin has no `static`. A **companion object** is a single object tied to a class that lets you call members on the class name:

```kotlin
class User private constructor(val id: Int) {
    companion object {
        const val TABLE = "users"
        fun create(id: Int) = User(id)   // factory
    }
}

User.create(1)      // looks static
User.TABLE
```

**But it's not the same as static** — it's a real **object instance** (`User.Companion`). That means it can:
- implement interfaces and extend classes,
- be passed as a value,
- have extension functions.

Implications interviewers probe:
- Members are **not truly static** on the JVM unless you add `@JvmStatic` (useful for Java callers) — otherwise Java sees `User.Companion.create(...)`.
- `const val` and `@JvmField` *do* compile to genuine static fields.
- There's **one** companion object per class, and it's initialized when the class is first loaded — so it's a handy place for factories and constants, but heavy work there delays class loading.

**Common follow-up:** "How do you make a singleton?" Use a top-level `object Foo { }`, not a companion — the companion belongs *to* a class, a top-level `object` stands alone.
