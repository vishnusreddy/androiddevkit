---
question: "How does Kotlin handle exceptions differently from Java?"
topic: kotlin
difficulty: junior
tags: ["kotlin", "exceptions", "error-handling"]
---

The headline difference: **Kotlin has no checked exceptions.** Every exception is unchecked, so you're never *forced* to `try/catch` or declare `throws`. This removes Java's boilerplate but means the compiler won't remind you an API can fail - you have to know.

```kotlin
// No "throws IOException" needed; caller isn't forced to handle it
fun readConfig(): String = File("config").readText()
```

Other points:
- **`try` is an expression** - it returns a value:
  ```kotlin
  val n = try { input.toInt() } catch (e: NumberFormatException) { 0 }
  ```
- **`@Throws`** - annotate a function so **Java** callers see the checked exception (needed for interop, e.g. a function Java code must catch).
- **`runCatching`** wraps a block in a `Result<T>`, turning exceptions into values for functional handling:
  ```kotlin
  val result = runCatching { api.fetch() }
      .map { it.body }
      .getOrElse { fallback }
  ```
- **`Nothing`** is the type of `throw`, which is why it slots into any expression (`val x = a ?: throw ...`).

**Caution interviewers like to hear:** don't catch broad `Exception` around coroutine code - it can swallow `CancellationException` and break structured cancellation. Rethrow it, or catch specific types.
