---
title: Jetpack Compose
description: Recomposition, state & the snapshot system, side effects, modifiers, custom layout, performance, and the mental model behind declarative UI.
category: Android
order: 20
icon: "◧"
---

Compose is now **table stakes** for Android UI roles - Google's recommended
toolkit for new apps, and the area where interviewers most quickly tell apart
people who copy patterns from people who understand the runtime.

### A simple study path

Start with state, recomposition, `remember`, state hoisting, modifiers, and
`LazyColumn`. Then learn effects, ViewModel collection, navigation, and testing.
Compiler transforms, the slot table, custom layouts, and performance internals
can wait until you are comfortable building normal screens.

### What gets tested

- **Mental model** - declarative UI (`UI = f(state)`), the three phases (composition → layout → drawing), the composable lifecycle.
- **State** - `mutableStateOf` & the snapshot system, `remember`/`rememberSaveable`, state hoisting, stateless vs stateful, `derivedStateOf`.
- **Recomposition & performance** - what triggers it, recomposition scopes & donut-hole skipping, **stability** (`@Immutable`/`@Stable`, unstable collections), deferred reads, Baseline Profiles.
- **Side effects** - `LaunchedEffect`, `DisposableEffect`, `SideEffect`, `rememberCoroutineScope`, `produceState`, `snapshotFlow`, `rememberUpdatedState`.
- **Layout & modifiers** - modifier order, custom `Layout`, constraints/intrinsics, `BoxWithConstraints`, slot APIs.
- **Lists** - `LazyColumn`, keys, `contentType`, pagination.
- **Ecosystem** - navigation, theming, animation, gestures, interop (`AndroidView`/`ComposeView`), accessibility, insets, testing & previews.
- **Internals** - the compiler transform, slot table, positional memoization (for senior roles).

### How interviewers ask

Lots of **"why does/doesn't this recompose (or update)?"** output questions
(modifier order, stale `remember`, mutating a list in place), **comparisons**
(`remember` vs `rememberSaveable`, `collectAsState` vs `collectAsStateWithLifecycle`),
and **"how would you optimize this screen?"** The signal they want is that you
understand **recomposition and the phases** - almost every Compose question
reduces to those two ideas.

> **Prep tip:** for any composable, be able to answer "what state does it read,
> which scope recomposes when that changes, and in which phase?" Master that and
> the performance questions answer themselves.
