---
question: "What is a lambda with receiver, and how does it enable Kotlin DSLs?"
topic: kotlin
difficulty: senior
tags: ["kotlin", "dsl", "lambdas", "receiver"]
---

A **lambda with receiver** has type `T.() -> R` instead of `(T) -> R`. Inside the lambda, `this` is the receiver `T`, so you can call its members directly without a qualifier. This is the foundation of Kotlin DSLs.

```kotlin
class HtmlBuilder {
    val sb = StringBuilder()
    fun p(text: String) { sb.append("<p>$text</p>") }
}

// The block is a lambda with HtmlBuilder as receiver
fun html(block: HtmlBuilder.() -> Unit): String =
    HtmlBuilder().apply(block).sb.toString()

val page = html {
    p("Hello")     // `this` is HtmlBuilder — call p() directly
    p("World")
}
```

This is exactly how `buildString { append(...) }`, Gradle Kotlin DSL, Compose `Modifier` chains, and `apply { }` work — `apply` is literally `fun T.apply(block: T.() -> Unit): T`.

**Advanced point:** `@DslMarker` annotations stop you from accidentally calling an **outer** receiver's methods inside a nested block, which keeps nested DSLs (like a table inside a row) unambiguous.

**Soundbite:** "A receiver lambda turns the object into the implicit `this` of the block — that's what makes builder DSLs read like a mini-language."
