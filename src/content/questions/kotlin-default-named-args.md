---
question: "How do default and named arguments work, and how do they replace the builder pattern?"
topic: kotlin
difficulty: junior
tags: ["kotlin", "functions", "default-args"]
---

**Default arguments** let a parameter have a fallback, so callers can omit it. **Named arguments** let callers pass parameters by name in any order, which makes calls readable and lets you skip optional ones in the middle.

```kotlin
fun showSnackbar(
    message: String,
    duration: Int = LENGTH_SHORT,
    actionLabel: String? = null,
    onAction: (() -> Unit)? = null,
) { /* ... */ }

// Call only what you need, by name:
showSnackbar("Saved")
showSnackbar("Undo delete", actionLabel = "Undo", onAction = { restore() })
```

Together they **replace most builder patterns and telescoping overloads** in Kotlin - no `Builder` class, no five overloaded constructors. One function with defaults covers it.

**Interop gotchas:**
- Java callers don't see Kotlin defaults. Add **`@JvmOverloads`** to generate overloads for them - essential when writing a custom `View` whose constructors Java/XML inflation calls.
- Named arguments don't work when calling **Java** methods (the parameter names aren't reliably in the bytecode).
