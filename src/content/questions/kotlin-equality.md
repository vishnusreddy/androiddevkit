---
question: "What's the output? Explain == vs === with the Integer cache."
topic: kotlin
difficulty: mid
tags: ["kotlin", "output-based", "equality"]
---

```kotlin
val a: Int? = 127
val b: Int? = 127
val c: Int? = 128
val d: Int? = 128

println(a == b)    // ?
println(a === b)   // ?
println(c == d)    // ?
println(c === d)   // ?
```

**Output:**

```
true
true
true
false
```

**Why:**
- `==` calls `equals()` → **structural** equality. All four comparisons by value are `true`.
- `===` is **referential** equality (same object).
- The `Int?` types are **boxed** (`Integer`). The JVM caches boxed integers in the range **−128..127**, so `a` and `b` point to the *same* cached object → `a === b` is `true`. `128` is outside the cache, so `c` and `d` are different boxed objects → `c === d` is `false`.

**The lesson:** never use `===` to compare values — it's an implementation detail of boxing. Use `==` for value equality. (With non-nullable `Int`, there's no boxing and this trap disappears — it only shows up because the types are nullable, forcing boxing.)
