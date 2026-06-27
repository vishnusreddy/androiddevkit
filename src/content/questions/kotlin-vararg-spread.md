---
question: "How do vararg and the spread operator work?"
topic: kotlin
difficulty: junior
order: 130
starred: false
section: "Functions and idioms"
tags: ["kotlin", "functions", "vararg"]
---

`vararg` lets a function accept a variable number of arguments; inside the function the parameter is an **`Array`**.

```kotlin
fun sum(vararg numbers: Int): Int = numbers.sum()
sum(1, 2, 3)        // pass any count
sum()               // or none
```

To pass an **existing array** where a `vararg` is expected, use the **spread operator `*`**, which unpacks the array into individual arguments:

```kotlin
val arr = intArrayOf(1, 2, 3)
sum(*arr)                       // spread
sum(0, *arr, 4)                 // can mix with other args
```

Points to know:
- A function can have **only one** `vararg` parameter. If it's not the last one, later parameters must be passed by **name**.
- For reference types it's an `Array<out T>`; for primitives use the specialized arrays (`IntArray`) to avoid boxing.
- Spread copies the array's references into the call, so it's a shallow pass.

**Real use:** `listOf(vararg elements: T)`, `arrayOf(...)`, and forwarding args: `fun log(vararg args: Any) = print(format(*args))`.
