---
title: Navigation, deep links, adaptive layouts, and window state
description: Preserve user intent across navigation and deep links while adapting information architecture to available window space.
level: mid
order: 7
duration: 70 min
quizHref: /practice/?test=jetpack-compose-test
quizLabel: Take the UI and Compose quiz
---

Navigation is a model of destinations, history, and user intent. It defines the identifier that crosses a screen boundary, the behavior of Back and Up, the treatment of an external link, and the way one feature reorganizes itself when a window gains enough space for two panes. A call that merely changes the visible screen is only the final step of this model.

This chapter treats deep links as untrusted public input and adaptive layout as an information-architecture decision. The implementation should preserve the user's intent through authentication, recreation, resizing, and navigation history without passing unstable object graphs between destinations.

## Learning goals

- Model navigation as destination state plus user actions.
- Explain back-stack operations and state restoration.
- Treat deep links as untrusted external input.
- Keep navigation types at the UI boundary rather than in lower layers.
- Design list-detail and primary-secondary layouts for adaptive windows.

## Destinations carry identifiers, not object graphs

Pass the smallest durable key needed to load a destination:

```kotlin
@Serializable
data class ArticleRoute(val articleId: String)
```

Avoid passing a large mutable model through a `Bundle`, Intent extra, or serialized route. Reasons:

- Binder transactions have a size limit.
- The object can become stale while in the back stack.
- Schema changes complicate restoration.
- Two screens may accidentally edit different copies.

Load the current record from the repository using `articleId`.

## Navigation belongs at the UI boundary

A ViewModel can expose that the user completed an action. The UI controller translates it into navigation because it owns the `NavController`, Activity, or platform navigator.

```kotlin
sealed interface CheckoutEvent {
    data class OrderConfirmed(val orderId: String) : CheckoutEvent
}

// UI layer
LaunchedEffect(Unit) {
    viewModel.events.collect { event ->
        when (event) {
            is CheckoutEvent.OrderConfirmed ->
                navController.navigate(ReceiptRoute(event.orderId))
        }
    }
}
```

Do not inject `NavController` into repositories or use cases. It ties business and data code to a particular UI implementation and lifecycle.

## Back stack mental model

Navigation usually maintains entries, each with destination, arguments, lifecycle, saved state, and a ViewModel store.

Key operations:

- Navigate pushes or reveals a destination according to navigator rules.
- Pop removes the current entry and returns to the previous one.
- `popUpTo` removes entries up to a target, optionally including the target.
- `launchSingleTop` avoids a duplicate top entry.
- State saving and restoration can preserve multiple top-level stacks.

Bottom navigation commonly wants one restorable stack per top-level destination. Repeatedly pushing a new copy of the same tab root creates surprising back behavior.

```kotlin
navController.navigate(topLevelRoute) {
    popUpTo(navController.graph.startDestinationId) {
        saveState = true
    }
    launchSingleTop = true
    restoreState = true
}
```

The exact API differs between string routes, typed routes, and navigation versions, but the behavior should be explicit.

## Back is not always Up

- **Back** returns through the user's navigation history and may leave the app.
- **Up** moves within the app's information hierarchy.

They often match, but a deep-linked detail screen may have no in-app parent in the actual task history. Decide whether to synthesize a parent stack or return to the caller.

Predictive back requires animations and custom back handlers to cooperate with system progress rather than consuming back unconditionally.

## Deep links are public input surfaces

An app link or custom scheme can be launched by another app. Treat every argument as untrusted:

- Validate IDs, path segments, and enum-like values.
- Require authentication and authorization again.
- Reject unsupported hosts and schemes.
- Never perform a destructive action solely because a URL requested it.
- Avoid logging sensitive query parameters.

```kotlin
fun parseArticleLink(uri: Uri): ArticleRoute? {
    if (uri.scheme != "https") return null
    if (uri.host != "androiddevkit.com") return null
    val id = uri.pathSegments
        .takeIf { it.size == 2 && it[0] == "articles" }
        ?.get(1)
        ?.takeIf { ARTICLE_ID.matches(it) }
        ?: return null
    return ArticleRoute(id)
}
```

Android App Links use verified HTTPS ownership. Custom URI schemes can collide because another app may register the same scheme.

## Authentication gates preserve intent

If a signed-out user opens a protected link:

1. Parse and validate the destination.
2. Store a narrow pending route in saved or durable state as appropriate.
3. Navigate to authentication.
4. On acknowledged success, consume the pending route once.
5. Recheck authorization before loading protected content.

Avoid storing an arbitrary raw Intent for later execution.

## Navigation results

Returning a result through a previous back stack entry can work for ephemeral UI coordination. Durable changes should flow from the repository so every observer sees the same truth.

For example, an edit screen writes the updated article to the repository. The list observes Room and updates automatically. It should not depend only on a one-time navigation result carrying the entire updated object.

## State restoration

Navigation entry state can be destroyed and recreated after process death. Keep only reconstructable, small values in saved state:

- IDs and filter selections.
- Scroll position when the component supports saving it.
- Draft text of reasonable size.

Do not put large lists, bitmaps, database results, or dependency objects in saved state. Rebuild them from durable sources.

## Adaptive UI starts with window space

Do not branch only on device names such as phone or tablet. A tablet app can run in a narrow split window, and a foldable can change posture while visible.

Respond to current window size and posture:

- Compact width may show one pane.
- Wider windows may show list and detail together.
- Navigation may shift from bottom bar to rail or drawer.
- Dialogs and sheets should not stretch without bounds.

```kotlin
@Composable
fun InboxRoute(
    windowSizeClass: WindowSizeClass,
    state: InboxUiState,
) {
    if (windowSizeClass.isWidthAtLeastBreakpoint(WIDTH_DP_MEDIUM_LOWER_BOUND)) {
        ListDetailLayout(state)
    } else {
        SinglePaneLayout(state)
    }
}
```

Use the current stable adaptive APIs in the project. Names and recommended helpers evolve, but the principle is stable: window space is runtime state.

## Selection replaces some navigation

In compact layout, tapping a row may navigate from list to detail. In expanded layout, the same action may update the selected item in the adjacent pane.

Model the user intent independently:

```kotlin
fun onArticleSelected(id: String) {
    savedStateHandle[SELECTED_ARTICLE] = id
}
```

The UI decides whether selection also changes the back stack. This prevents business state from being shaped around one screen arrangement.

## Fold, resize, multi-window, and keyboard

Adaptive testing should cover state changes while the screen is alive:

- Resize compact to expanded and back.
- Rotate and change posture.
- Enter split-screen or freeform window mode.
- Open the IME at each width.
- Increase font and display scale.
- Confirm selected content remains coherent.

Avoid using `LocalConfiguration.current.screenWidthDp` as a complete window strategy when a window-specific adaptive API is available.

## Common pitfalls

1. Passing whole object graphs between destinations.
2. Injecting a UI navigator into data code.
3. Treating back and Up as synonyms in every entry path.
4. Trusting a deep-link argument because the host looks familiar.
5. Building a new bottom-navigation stack on every tap.
6. Saving large results in `SavedStateHandle`.
7. Branching only on tablet vs phone.
8. Losing selection when a list-detail layout changes width.

## Examination prompts

- "What should a route argument contain?"
- "How do you keep NavController out of the ViewModel?"
- "`launchSingleTop`, `popUpTo`, and `restoreState`?"
- "Back vs Up?"
- "How do you secure a deep link?"
- "How would this list-detail screen work on a foldable?"
- "What survives process death in a navigation entry?"

## Practice checklist

1. Draw three top-level stacks and predict Back after switching tabs twice.
2. Add a verified HTTPS deep link and reject invalid hosts, paths, and IDs.
3. Open a protected deep link while signed out and resume it once after login.
4. Resize a list-detail screen without losing selection or duplicating ViewModels.
5. Test process restoration with only destination IDs in saved state.

## What you should be able to explain

- Navigation entries, back stacks, and state restoration.
- Deep-link validation and authentication gates.
- Route IDs instead of serialized models.
- Adaptive navigation and selection driven by window state.

Next: **dependency injection, Gradle, and release variants**, where runtime boundaries meet the build graph.
