---
question: "What Kotlin–Java interoperability issues and JVM annotations matter in Android code?"
topic: kotlin
difficulty: mid
order: 205
starred: false
section: "Java interoperability"
tags: ["kotlin", "java", "interop", "jvm"]
---

Kotlin and Java call each other directly on Android, but their type systems and language features do not line up perfectly. Strong answers focus on the boundary:

- **Platform types** such as `String!` come from unannotated Java. Kotlin cannot prove whether they are nullable, so validate them or improve the Java nullability annotations.
- Kotlin default arguments are not Java overloads. **`@JvmOverloads`** generates overloads by removing trailing default parameters.
- **`@JvmStatic`** exposes a companion/object function as a Java-style static method; **`@JvmField`** exposes a property as a field instead of getter/setter methods.
- Java SAM interfaces work naturally with Kotlin lambdas. Kotlin function types exposed to Java become `FunctionN` types, which may be awkward for a Java caller.
- Kotlin has no checked exceptions. Add **`@Throws(IOException::class)`** when Java callers should see a `throws` declaration.

```kotlin
class ImageLoader @JvmOverloads constructor(
    val cacheSize: Int = 100,
    val debug: Boolean = false,
) {
    companion object {
        @JvmField val DEFAULT_TAG = "Images"
        @JvmStatic fun create() = ImageLoader()
    }
}
```

Do not scatter JVM annotations everywhere. Add them when a Java caller, framework, reflection API, or generated code genuinely requires that JVM shape.
