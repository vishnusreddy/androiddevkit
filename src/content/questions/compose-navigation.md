---
question: "How does Navigation work in Compose? How do you pass arguments and scope a ViewModel to a destination?"
topic: jetpack-compose
difficulty: mid
tags: ["compose", "navigation"]
---

Navigation-Compose models the app as a **`NavHost`** with composable destinations addressed by routes, driven by a **`NavController`**.

```kotlin
val navController = rememberNavController()
NavHost(navController, startDestination = "feed") {
    composable("feed") {
        FeedScreen(onItemClick = { id -> navController.navigate("detail/$id") })
    }
    composable(
        "detail/{itemId}",
        arguments = listOf(navArgument("itemId") { type = NavType.StringType }),
    ) { backStackEntry ->
        val id = backStackEntry.arguments?.getString("itemId")!!
        DetailScreen(id)
    }
}
```

Key points:
- **Routes** are strings (older API) or **type-safe** classes/objects with Kotlin Serialization (newer Navigation 2.8+ type-safe routes) — prefer type-safe to avoid stringly-typed bugs.
- **Arguments** are declared with `navArgument` and read from the `backStackEntry`. Pass **IDs**, not whole objects — large/complex args don't belong in the back stack.
- **ViewModel scoping** — `hiltViewModel()` inside a `composable {}` scopes the ViewModel to that **NavBackStackEntry**, so it survives recomposition and config changes but is cleared when you pop the destination.
- **Nested graphs** group related destinations; a ViewModel scoped to a nested graph (`hiltViewModel(graphEntry)`) can be **shared** across screens in a flow (e.g. a multi-step checkout).
- **Results between screens** — use the previous entry's `SavedStateHandle`, or share a graph-scoped ViewModel, rather than passing data forward and back through routes.

**Common gotchas:** don't pass non-trivial objects as nav args (serialize an ID instead); use `popUpTo`/`launchSingleTop` to control the back stack; and remember each destination's ViewModel lifecycle is tied to its back stack entry.
