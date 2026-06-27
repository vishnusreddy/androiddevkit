---
question: "DataStore vs SharedPreferences - why migrate, and what are the differences?"
topic: android-fundamentals
difficulty: mid
tags: ["datastore", "sharedpreferences", "persistence"]
---

**SharedPreferences** is the old key-value store; **DataStore** (Jetpack) is its modern replacement, designed to fix SharedPreferences' flaws.

**SharedPreferences problems:**
- **`apply()`** is async but **`commit()`** does **synchronous disk I/O on the calling thread** - easy to block the main thread (and a known ANR source).
- Loads the **entire file into memory** on first access, synchronously - can cause jank at startup.
- **No error signaling**, no transactional safety, no first-class async API.
- `getString` etc. can return on the main thread after blocking.

**DataStore advantages:**
- **Fully async** and safe - built on **coroutines and Flow**. Reads are a `Flow`; writes are `suspend`. No main-thread I/O.
- **Transactional** writes with strong consistency, and it surfaces **errors** (e.g. `IOException`) through the Flow.
- Two flavors:
  - **Preferences DataStore** - untyped key-value (drop-in for SharedPreferences use cases).
  - **Proto DataStore** - **typed** schema via protobuf, with type safety.

```kotlin
val EXAMPLE_KEY = booleanPreferencesKey("dark_mode")

val darkMode: Flow<Boolean> = context.dataStore.data
    .map { it[EXAMPLE_KEY] ?: false }

suspend fun setDarkMode(on: Boolean) {
    context.dataStore.edit { it[EXAMPLE_KEY] = on }
}
```

**When to use which:**
- **DataStore** for new code - settings, flags, small typed config.
- **SharedPreferences** only for legacy code or trivial cases; DataStore even provides a **migration** (`SharedPreferencesMigration`).
- For **structured/relational** data, neither - use **Room**.
