---
question: "Why collect a Flow with repeatOnLifecycle? What problem does it solve?"
topic: coroutines
difficulty: mid
order: 170
starred: true
section: "State and lifecycle"
tags: ["flow", "lifecycle", "repeatOnLifecycle", "android"]
---

The problem: a plain `lifecycleScope.launch { flow.collect { } }` keeps collecting **even when the app is in the background**. The UI isn't visible, but the flow still does work and holds references - wasted CPU/battery and a potential crash if you touch views.

**`repeatOnLifecycle(STATE)`** suspends, and **runs its block only while the lifecycle is at least in that state**, cancelling it when the lifecycle drops below and restarting it when it comes back.

```kotlin
class MyFragment : Fragment() {
    override fun onViewCreated(view: View, b: Bundle?) {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.uiState.collect { render(it) }   // collected only while STARTED
            }
        }
    }
}
```

What happens: when the app goes to the background (below `STARTED`), the collection coroutine is **cancelled** (unsubscribing from the flow); when it returns to the foreground, the block **restarts** and re-collects. For a `StateFlow`, you immediately get the current value back.

**Equivalents / related:**
- **`flowWithLifecycle(lifecycle, STARTED)`** - operator form for a single flow.
- **Compose:** `collectAsStateWithLifecycle()` does the same lifecycle-aware collection automatically - prefer it over `collectAsState()`.

**Common bug it prevents:** using `LATEST`/`launchWhenStarted` (deprecated) only *paused* the coroutine but kept the flow subscription alive upstream - `repeatOnLifecycle` actually **cancels** it, which (combined with `WhileSubscribed` upstream) lets the producer stop too.
