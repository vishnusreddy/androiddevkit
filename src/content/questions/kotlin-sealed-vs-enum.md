---
question: "Sealed class vs enum vs abstract class - when do you use each?"
topic: kotlin
difficulty: mid
tags: ["kotlin", "sealed-class", "enum", "state"]
---

All three model a restricted set of types, but at different levels.

- **`enum`** - a fixed set of **singleton instances**, each the same type. Use it for a closed set of constants (`Direction.NORTH`). Every entry is one object; they can't carry per-instance varying state across many instances.
- **`sealed class` / `sealed interface`** - a restricted hierarchy of subclasses known at compile time, but **each subtype can have its own properties and multiple instances**. Perfect for modeling UI state or results.
- **`abstract class`** - an open hierarchy; subclasses can be defined *anywhere*, including other modules. Use when you don't need exhaustiveness and want open extension.

```kotlin
sealed interface UiState {
    data object Loading : UiState
    data class Success(val items: List<Item>) : UiState
    data class Error(val message: String) : UiState
}
```

The big win for `sealed` is **exhaustive `when`** - the compiler knows all subtypes, so you don't need an `else` and it errors if you add a case and forget to handle it:

```kotlin
when (state) {
    UiState.Loading    -> showSpinner()
    is UiState.Success -> render(state.items)
    is UiState.Error   -> showError(state.message)
}  // no else needed
```

**Rule of thumb:** closed set of plain constants → `enum`; closed set of *variants that carry different data* → `sealed`; open extension → `abstract`.
