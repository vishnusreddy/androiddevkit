---
question: "How do you mix Compose and the View system in both directions?"
topic: jetpack-compose
difficulty: mid
order: 350
starred: false
section: "App integration"
tags: ["compose", "interop", "views"]
---

Interop goes both ways and is common during migration.

**Views inside Compose - `AndroidView`:**
```kotlin
AndroidView(
    factory = { context -> MapView(context) },  // create once
    update = { mapView -> mapView.setZoom(zoom) }, // re-run on state change
    modifier = Modifier.fillMaxSize(),
)
```
- **`factory`** runs **once** to create the View.
- **`update`** runs on initial composition and whenever a state it reads changes - bridge Compose state into the View here.
- Use it for things Compose lacks or that are expensive to reimplement: `MapView`, `WebView`, `AdView`, custom legacy views, `SurfaceView`.
- `AndroidViewBinding` wraps a whole XML layout via ViewBinding.

**Compose inside Views - `ComposeView`:**
```kotlin
// In XML or code, add a ComposeView, then:
composeView.setContent {
    MyComposable()
}
```
- Lets you adopt Compose screen-by-screen or widget-by-widget inside a View-based app.
- Set the right **`ViewCompositionStrategy`** (e.g. `DisposeOnViewTreeLifecycleDestroyed`) so the composition is disposed with the host's lifecycle - especially in `RecyclerView` rows or Fragments.

**Gotchas:**
- `AndroidView`'s `update` is where you push state; don't recreate the View in `factory` on recomposition.
- Watch lifecycle/disposal for `ComposeView` in lists and Fragments to avoid leaks.
- Theming/`CompositionLocal` don't automatically cross the boundary - pass values explicitly.
