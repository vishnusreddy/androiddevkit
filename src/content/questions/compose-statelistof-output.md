---
question: "Why does changing a MutableList sometimes fail to update Compose?"
topic: jetpack-compose
difficulty: mid
tags: ["compose", "output-based", "state", "collections"]
---

```kotlin
@Composable
fun BrokenList() {
    val items = remember { mutableStateOf(mutableListOf("a")) }
    Column {
        Button(onClick = { items.value.add("b") }) { Text("Add") }   // ❌ no update
        items.value.forEach { Text(it) }
    }
}
```

**The bug:** tapping "Add" mutates the list **in place**. The `MutableState` still holds the **same list reference**, so `.value` hasn't "changed" by Compose's equality check - no recomposition is scheduled, and the new item never appears.

**Two correct approaches:**

**1. Use an observable collection - `mutableStateListOf`:**
```kotlin
val items = remember { mutableStateListOf("a") }
Button(onClick = { items.add("b") }) { Text("Add") }   // ✅ add triggers recomposition
items.forEach { Text(it) }
```
`mutableStateListOf` (and `mutableStateMapOf`) are snapshot-aware: structural changes (add/remove/set) notify Compose.

**2. Use an immutable list and replace the reference:**
```kotlin
var items by remember { mutableStateOf(listOf("a")) }
Button(onClick = { items = items + "b" }) { Text("Add") }  // ✅ new list → new reference
```
Assigning a **new** list changes `.value`, so Compose detects it.

**Why this happens:** `MutableState` schedules recomposition when `.value` is **set to a different value** (by `equals`). Mutating the contained list doesn't change the reference, so nothing fires. Either make the container observable (`mutableStateListOf`) or always assign a **new** immutable instance.

**Bonus:** the immutable approach also keeps the parameter **stable** for child composables - better for skipping recomposition.
