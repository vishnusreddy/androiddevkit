---
question: "val vs var vs const val — what's the difference?"
topic: kotlin
difficulty: junior
tags: ["kotlin", "basics", "immutability"]
---

- **`var`** — a mutable (reassignable) variable.
- **`val`** — a read-only reference. You can't reassign it, but the object it points to may still be mutable (`val list = mutableListOf(1)` lets you `list.add(2)`).
- **`const val`** — a *compile-time* constant. It's inlined at the call site and must be a top-level or `object`/`companion object` member with a primitive or `String` value.

```kotlin
const val API_VERSION = "v1"        // compile-time, inlined
val createdAt = System.currentTimeMillis()  // runtime, just read-only
var counter = 0                      // mutable
```

**Key distinction interviewers want:** `val` is about the *reference* being immutable, not deep immutability. `const` is resolved by the compiler, so it can't hold anything computed at runtime.

Prefer `val` by default — it makes code easier to reason about and is required for things like smart casts on properties.
