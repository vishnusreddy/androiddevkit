---
question: "What is a backing field, and when is one generated? (the `field` keyword)"
topic: kotlin
difficulty: mid
tags: ["kotlin", "properties", "backing-field"]
---

A Kotlin property is really a **getter (and setter)**, not a raw field. A **backing field** - referenced as `field` inside the accessor - is the actual storage, and the compiler generates it **only when needed**: when you use the default accessor, or you reference `field` in a custom one.

```kotlin
var counter: Int = 0
    set(value) {
        if (value >= 0) field = value   // `field` = the backing field
    }

// Computed property: NO backing field - just a getter
val isEmpty: Boolean
    get() = size == 0
```

**Key points:**
- Using `field` avoids infinite recursion. Writing `set(value) { counter = value }` would call the setter again forever - `field = value` writes storage directly.
- A property with **only a custom getter** and no `field` reference stores nothing - it's computed each call.
- A common pattern is the **private mutable / public read-only** pair (no custom `field` needed):

```kotlin
private val _state = MutableStateFlow(UiState())
val state: StateFlow<UiState> = _state   // expose read-only view
```
