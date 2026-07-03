---
question: "How do default and named arguments work, and how do they replace the builder pattern?"
topic: kotlin
difficulty: junior
order: 70
starred: false
section: "Functions and idioms"
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

Together they can replace many builder patterns and telescoping overloads in
Kotlin. They are a good fit when construction is immediate and validation is
simple; a builder still earns its place for staged construction, complex
validation, or Java-first APIs.

**Interop gotchas:**
- Java callers don't see Kotlin defaults. Add **`@JvmOverloads`** when Java or
  framework callers need generated trailing-argument overloads. Custom Views
  may use it for XML-compatible constructors, or declare those constructors
  explicitly.
- Named arguments don't work when calling **Java** methods (the parameter names aren't reliably in the bytecode).
