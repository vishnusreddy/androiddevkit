---
question: "What are local functions, and why use them?"
topic: kotlin
difficulty: mid
tags: ["kotlin", "functions", "closures"]
---

A **local function** is a function declared **inside another function**. It's scoped to its enclosing function and can access that function's parameters and local variables (it forms a closure over them).

```kotlin
fun saveUser(user: User) {
    // local helper — has access to `user`
    fun validate(value: String, field: String) {
        require(value.isNotBlank()) { "$field is empty for ${user.id}" }
    }

    validate(user.name, "name")
    validate(user.email, "email")
}
```

Why reach for them:
- **Avoid repetition** without exposing a private helper to the whole class — the helper is only meaningful here.
- **Close over local state**, so you don't have to thread the same parameters through every call (note `validate` uses `user` without it being passed).
- **Keep the API surface small** — the function isn't visible outside, so it doesn't clutter the class.

**Trade-off:** a local function that captures variables compiles to an object capturing that state, so in hot paths it can allocate. For deeply nested logic, a `private` method is sometimes clearer. But for a small, single-use helper that needs the enclosing scope, a local function is the cleanest tool.
