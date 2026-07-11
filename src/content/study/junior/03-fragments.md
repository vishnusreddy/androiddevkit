---
title: Fragments and the view-lifecycle boundary
description: Learn the separate lifetimes of a Fragment and its view, then apply that distinction to bindings, observers, and navigation.
level: junior
order: 3
duration: 45 min
quizHref: /practice/?test=android-fundamentals-test
quizLabel: Take the fundamentals quiz
---

A **Fragment** is a controller that can contribute UI and navigation to an Activity. Its instance lifecycle and its view lifecycle are deliberately different. A Fragment may remain in the FragmentManager while its view hierarchy is destroyed, then create a replacement hierarchy later. Every safe Fragment implementation begins by treating those two lifetimes as separate ownership domains.

A `View`, View Binding, adapter connected to views, or observer that updates views belongs to the view lifecycle. Retaining one after `onDestroyView` keeps the obsolete hierarchy reachable and can produce a memory leak or a stale UI update. This distinction remains important in Compose-first applications because established applications, ViewPager integrations, and navigation hosts commonly retain Fragment boundaries.

## Learning goals

- Separate the Fragment instance lifecycle from the lifecycle of its current view hierarchy.
- Create and clear a View Binding at the correct boundary.
- Observe LiveData and collect UI streams with `viewLifecycleOwner`, not the Fragment instance.
- Explain when Fragment semantics remain relevant in a Compose-based application.

## Fragment vs view lifecycle

### Fragment instance lifecycle (simplified)

Rough order when a Fragment is added and later removed:

`onAttach` → `onCreate` → `onCreateView` → `onViewCreated` → `onStart` → `onResume` → … → `onPause` → `onStop` → `onDestroyView` → `onDestroy` → `onDetach`

When the Fragment is only on the back stack and its view is destroyed:

- Instance may still exist (`onDestroy` not called yet).
- View hierarchy is torn down (`onDestroyView` **was** called).
- Coming back calls `onCreateView` again on the **same** instance.

### View lifecycle

`viewLifecycleOwner` is a LifecycleOwner that tracks the Fragment’s **view**. It becomes available after `onCreateView` and is destroyed in `onDestroyView`.

**Rule:** anything that touches views, bindings, or adapters must be scoped to the view lifecycle.

## Keep the view boundary clear

### View Binding pattern

```kotlin
class ArticleFragment : Fragment(R.layout.fragment_article) {

    private var _binding: FragmentArticleBinding? = null
    private val binding get() = checkNotNull(_binding)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentArticleBinding.bind(view)

        binding.retryButton.setOnClickListener {
            viewModel.refresh()
        }

        viewModel.state.observe(viewLifecycleOwner) { state ->
            bindState(state)
        }
    }

    override fun onDestroyView() {
        _binding = null
        super.onDestroyView()
    }
}
```

Why `_binding` is nullable and cleared:

1. After `onDestroyView`, the old view hierarchy must be eligible for GC.
2. If a delayed callback still runs, touching `binding` should fail loudly rather than update a detached tree.
3. The Fragment instance may still receive ViewModel updates; those observers must be cancelled via `viewLifecycleOwner`.

### Constructor / factory and arguments

Pass navigation arguments through the arguments `Bundle` (or Safe Args), not custom constructors that break process restoration:

```kotlin
// Safe Args style (generated)
val args: ArticleFragmentArgs by navArgs()
val id = args.articleId
```

The system can recreate your Fragment after process death using the empty constructor + arguments bundle. Custom non-empty constructors break that.

## Observe state with the view lifecycle

### LiveData

```kotlin
// Correct
viewModel.article.observe(viewLifecycleOwner) { article ->
    binding.title.text = article.title
}

// Incorrect for view updates
viewModel.article.observe(this) { ... }
```

Using `this` (Fragment as LifecycleOwner) can deliver updates when the view is gone, or keep observers active while the Fragment sits on the back stack without a view - classic crashes and leaks.

### Kotlin Flow / coroutines

```kotlin
viewLifecycleOwner.lifecycleScope.launch {
    viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.uiState.collect { state ->
            bindState(state)
        }
    }
}
```

`repeatOnLifecycle` cancels the collecting coroutine when the view lifecycle falls below `STARTED` and restarts when it rises again. That avoids collecting (and updating UI) while the view is stopped, and plays well with hot flows.

In Compose hosted by a Fragment, you still need correct host lifecycle awareness for anything outside Compose state.

## Transactions, back stack, and navigation

Historically you wrote:

```kotlin
parentFragmentManager.commit {
    replace(R.id.container, ArticleFragment.newInstance(id))
    addToBackStack("article")
}
```

Today most apps use the **Navigation component**:

- A navigation graph declares destinations (Fragments or Compose).
- `NavController` owns the back stack.
- Arguments and deep links are modeled in the graph.

Junior interviews still expect you to know:

- `add` vs `replace`
- `addToBackStack` vs not (Back will not restore the previous Fragment if you did not add it)
- Child Fragment managers for nested Fragments (`childFragmentManager`)

## Communication patterns

### Prefer shared ViewModel over raw callbacks

```kotlin
// Activity-scoped shared ViewModel for sibling Fragments
val shared: CheckoutViewModel by activityViewModels()

// Fragment-scoped for this screen only
val vm: ArticleViewModel by viewModels()
```

Avoid holding references from Fragment A to Fragment B. Prefer:

1. Shared ViewModel scoped to the NavGraph or Activity
2. Fragment result APIs (`setFragmentResult` / `setFragmentResultListener`)
3. Navigation with return values / saved state handles

```kotlin
// Producer
setFragmentResult("pick_topic", bundleOf("id" to topicId))

// Consumer
setFragmentResultListener("pick_topic") { _, bundle ->
    val id = bundle.getString("id")
}
```

## Fragments today (Compose era)

Compose does not remove Fragment concepts; it often **hosts** Compose:

```kotlin
class FeedFragment : Fragment() {
    override fun onCreateView(...): View {
        return ComposeView(requireContext()).apply {
            setViewCompositionStrategy(
                ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed
            )
            setContent {
                FeedScreen(viewModel = viewModel)
            }
        }
    }
}
```

`DisposeOnViewTreeLifecycleDestroyed` ties composition disposal to the view lifecycle - the same principle as clearing bindings.

When is a pure Compose single-Activity app still asked about Fragments?

- Multi-module navigation with Fragment destinations
- ViewPager2 + FragmentStateAdapter
- Interop with existing screens
- Understanding `viewLifecycleOwner` questions even if the answer is “we use ComposeView with correct disposal”

## Configuration change and process death

- Fragment **views** are rebuilt on configuration change.
- Fragment-scoped **ViewModels** survive configuration change.
- Arguments and `SavedStateHandle` help with process death for small keys; durable data still needs disk.

Do not store UI state only in view fields (`binding.title.text`) if it must return after rotation - the view is new. Drive UI from ViewModel state.

## Common pitfalls

1. **Using `requireActivity()` or `requireContext()` after the Fragment is detached** - crashes. Guard with lifecycle or use viewLifecycle-scoped work.
2. **Observing with `this` instead of `viewLifecycleOwner`.**
3. **Not nulling View Binding** in `onDestroyView`.
4. **Starting coroutines in `lifecycleScope` (Fragment) that update views** without `viewLifecycleOwner` / `repeatOnLifecycle`.
5. **Retaining large objects (bitmaps, adapters) on the Fragment instance** across `onDestroyView`.
6. **Nested Fragments with the wrong FragmentManager** (`parent` vs `child`).

## Examination prompts

- “Difference between Fragment lifecycle and view lifecycle?”
- “Why `viewLifecycleOwner`?”
- “What happens when a Fragment is on the back stack?”
- “How do two Fragments talk without holding references?”
- “How do you use Compose inside a Fragment safely?”

Strong answers always mention **leaks**, **detached views**, and **which LifecycleOwner cancels work**.

## Practice checklist

1. Implement a Fragment with View Binding; rotate and confirm no leak (LeakCanary if available).
2. Collect a StateFlow with `repeatOnLifecycle` and log when collection starts/stops as you navigate away.
3. Pass data back with `setFragmentResult`.
4. Host a small Compose screen in a `ComposeView` with `DisposeOnViewTreeLifecycleDestroyed`.

## What you should be able to explain

- Why a Fragment can outlive its views.
- The binding clear pattern and why it exists.
- Correct observation / collection owners.
- Fragment’s role in modern Navigation and Compose interop.

Next: **Lifecycle, configuration change, and process death** - the contract that ties Activities, Fragments, and ViewModels together.
