---
question: "Which Kotlin extension function is called when the runtime type is more specific?"
topic: code-snippet-output
difficulty: mid
order: 10
starred: true
section: "Objects and dispatch"
tags: ["kotlin", "output-based", "extensions", "dispatch"]
---

```kotlin
open class Screen
class HomeScreen : Screen()

fun Screen.label() = "screen"
fun HomeScreen.label() = "home"

val screen: Screen = HomeScreen()
println(screen.label())
```

**Output:**

```text
screen
```

Extensions do not add virtual members to a class. Kotlin chooses an extension
from the receiver's compile-time type, which is `Screen` here. The runtime object
being a `HomeScreen` does not change that choice.

If `label()` were an overridden member function, normal virtual dispatch would
call the `HomeScreen` implementation.

**How to reason about it:** write the declared type next to the receiver. Use
that type for extensions, and the runtime type for overridden members.
