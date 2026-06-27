---
question: "Why can remember return stale data when an input changes?"
topic: jetpack-compose
difficulty: mid
tags: ["compose", "output-based", "remember", "keys"]
---

```kotlin
@Composable
fun UserCard(userId: String) {
    // Caches the FIRST userId's data forever
    val userData = remember { loadUserSummary(userId) }
    Text(userData.name)
}
```

**The bug:** `remember { }` with no key computes its value **once** and reuses it for the composable's whole lifetime. If the parent re-renders `UserCard` with a **different `userId`** (same position in the tree), `remember` does **not** recompute - it keeps the original user's data. The card shows the wrong user.

**The fix - key the remember on the inputs it depends on:**
```kotlin
val userData = remember(userId) { loadUserSummary(userId) }
```
Now when `userId` changes, `remember` discards the cached value and recomputes.

`remember(key1, key2)` recomputes whenever **any key changes** - exactly like `LaunchedEffect`'s keys. A keyless `remember { }` means "compute once, never again for this slot."

**Related gotchas:**
- Don't do real I/O in `remember`/composition (`loadUserSummary` blocking is bad regardless) - use `LaunchedEffect`/`produceState`. The example simplifies to show the keying bug.
- The same stale-closure issue hits `LaunchedEffect(Unit) { ...uses userId... }` - add `userId` as a key or use `rememberUpdatedState`.
