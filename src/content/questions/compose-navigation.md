---
question: "How should navigation, arguments, and ViewModels be handled in Compose?"
topic: jetpack-compose
difficulty: mid
order: 80
starred: true
section: "App integration"
tags: ["compose", "navigation", "viewmodel"]
---

Keep navigation at the edge of a screen. A reusable screen should receive
callbacks, not a `NavController`:

```kotlin
@Composable
fun FeedScreen(
    state: FeedUiState,
    onOpenArticle: (String) -> Unit,
) {
    ArticleList(
        articles = state.articles,
        onArticleClick = { article -> onOpenArticle(article.id) },
    )
}
```

The navigation host connects that callback to the back stack. In Navigation
Compose, prefer type-safe routes where the project version supports them:

```kotlin
@Serializable data object Feed
@Serializable data class Article(val articleId: String)

NavHost(navController, startDestination = Feed) {
    composable<Feed> {
        FeedRoute(
            onOpenArticle = { id ->
                navController.navigate(Article(id))
            },
        )
    }

    composable<Article> { backStackEntry ->
        val route = backStackEntry.toRoute<Article>()
        ArticleRoute(articleId = route.articleId)
    }
}
```

Pass a small identifier, not a whole domain object. The destination can load the
current data from its repository or `ViewModel`. This avoids stale copies and
keeps the back stack's saved state small.

A destination's `ViewModel` is normally scoped to its `NavBackStackEntry`. It
survives recomposition and configuration change, then clears when that entry is
removed. Scope a shared `ViewModel` to a parent graph only when several
destinations genuinely own one flow, such as checkout.

Senior discussion points include deep links, multiple back stacks, process
recreation, and result delivery. The principle stays the same: make back-stack
ownership explicit and keep composables testable without a navigation runtime.

Navigation libraries are evolving, including Navigation 3 for Compose-first
apps. State the version and architecture you have used rather than mixing APIs
from different generations in one example.
