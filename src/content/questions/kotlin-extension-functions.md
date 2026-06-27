---
question: "How do extension functions work under the hood? Are they resolved statically or dynamically?"
topic: kotlin
difficulty: mid
tags: ["kotlin", "extensions", "dispatch"]
---

An extension function doesn't actually modify the class. The compiler turns it into a **static method that takes the receiver as its first argument**. So this:

```kotlin
fun String.shout() = uppercase() + "!"
"hi".shout()
```

compiles to roughly `StringExtKt.shout("hi")`.

The crucial consequence: **extensions are dispatched statically, by the declared type**, not the runtime type. There's no virtual dispatch / polymorphism.

```kotlin
open class A
class B : A()
fun A.name() = "A"
fun B.name() = "B"

val x: A = B()
println(x.name())   // "A"  — uses the static type A, not B
```

Other things to know:
- A **member function always wins** over an extension with the same signature.
- Extensions can't access `private`/`protected` members of the receiver — they're just outside static functions.
- They're great for keeping APIs focused and adding utilities to types you don't own (`Context`, `View`, `Flow`), which is why Android codebases lean on them heavily.

**Interview trap:** the polymorphism question above. If you say it prints "B", that's the classic miss.
