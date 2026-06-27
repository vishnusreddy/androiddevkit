---
question: "How does the Compose compiler work? What is positional memoization and the slot table?"
topic: jetpack-compose
difficulty: senior
tags: ["compose", "internals", "compiler"]
---

`@Composable` is not a normal function - the **Compose compiler plugin** transforms it. The key transformations:

- **`$composer` parameter** - every composable gets a hidden `Composer` parameter threaded through. The Composer is how composition reads/writes the tree.
- **Group calls** - the compiler inserts `startRestartGroup`/`endRestartGroup` (and movable/replaceable groups) so Compose can track and **restart** just this scope.
- **Skipping logic** - it generates code to compare parameters and **skip** the body if they're stable and unchanged.

**The slot table** is the in-memory data structure that **stores composition state** - the tree of groups, `remember`ed values, and `CompositionLocal`s. It's a flat, gap-buffer-backed array optimized for the common case: re-running composables in the same order.

**Positional memoization** is the core idea: Compose identifies each composable and each `remember` by its **position in the execution order** (call site), not by a name. That's why:
- `remember { }` at the same call site returns the same stored value across recompositions.
- Calling composables conditionally (`if`) is fine, but reordering them without `key()` can confuse identity - hence `key()` to give stable identity in loops.

```kotlin
// The compiler turns this:
@Composable fun Greeting(name: String) { Text("Hi $name") }
// into roughly:
fun Greeting(name: String, $composer: Composer, $changed: Int) {
    $composer.startRestartGroup(...)
    if ($changed and 0b1 == 0 && $composer.skipping) { $composer.skipToGroupEnd() }
    else { Text("Hi $name", $composer) }
    $composer.endRestartGroup()?.updateScope { Greeting(name, it, $changed) }
}
```

**Why this matters:** it explains *why* the rules exist - why composables must be side-effect-free and idempotent (they re-run), why identity is positional (slot table), and why stability enables skipping.
