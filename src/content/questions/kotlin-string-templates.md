---
question: "How do string templates and raw strings work in Kotlin?"
topic: kotlin
difficulty: junior
tags: ["kotlin", "strings", "basics"]
---

**String templates** embed values directly with `$`:

```kotlin
val name = "Ada"
val items = listOf(1, 2, 3)

"Hello $name"                 // simple variable
"Count: ${items.size}"        // any expression in ${ }
"Upper: ${name.uppercase()}"  // method calls
"Price: \$${amount}"          // escape a literal $ with \$
```

**Raw strings** (triple-quoted) span multiple lines and don't process escape sequences — ideal for JSON, regex, SQL, and paths:

```kotlin
val json = """
    {
        "name": "$name",
        "active": true
    }
""".trimIndent()              // strip the common leading indentation

val regex = """\d{3}-\d{4}""".toRegex()   // no double-escaping backslashes
```

Useful helpers:
- **`trimIndent()`** removes the common leading whitespace from every line.
- **`trimMargin()`** trims up to a margin prefix (default `|`).
- Raw strings still support `$` templates; to write a literal `$`, use `${'$'}`.

**Why interviewers ask:** raw strings + `trimIndent()` are the idiomatic way to keep test fixtures, regexes, and embedded snippets readable without escape-character noise.
