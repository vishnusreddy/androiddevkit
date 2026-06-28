---
question: "How do you implement infinite scroll / pagination in Compose?"
topic: jetpack-compose
difficulty: mid
order: 360
starred: false
section: "Lists"
tags: ["compose", "paging", "lazycolumn"]
---

Two approaches.

**1. Paging 3 (recommended for real data):**
```kotlin
// ViewModel
val items: Flow<PagingData<Item>> = Pager(PagingConfig(pageSize = 20)) {
    ItemPagingSource(api)
}.flow.cachedIn(viewModelScope)

// UI
val lazyItems = viewModel.items.collectAsLazyPagingItems()
LazyColumn {
    items(lazyItems.itemCount, key = lazyItems.itemKey { it.id }) { index ->
        lazyItems[index]?.let { ItemRow(it) }
    }
    // footer based on load state
    when (lazyItems.loadState.append) {
        is LoadState.Loading -> item { LoadingRow() }
        is LoadState.Error -> item { RetryRow { lazyItems.retry() } }
        else -> {}
    }
}
```
Paging 3 handles page requests, caching, retries, placeholders, and exposes `loadState`. `collectAsLazyPagingItems()` integrates it with `LazyColumn`. With a `RemoteMediator` + Room it becomes offline-first (DB is the source of truth).

**2. Manual "load more" with scroll detection** (simple lists):
```kotlin
val state = rememberLazyListState()
val shouldLoadMore by remember {
    derivedStateOf {
        val last = state.layoutInfo.visibleItemsInfo.lastOrNull()?.index ?: 0
        last >= items.size - 5            // near the end
    }
}
LaunchedEffect(shouldLoadMore) {
    if (shouldLoadMore) viewModel.loadNextPage()
}
```
Note the **`derivedStateOf`** - `visibleItemsInfo` changes every scroll frame, but `shouldLoadMore` only flips occasionally, so this avoids recomposing on every frame.

**When to use which:** Paging 3 for production lists from network/DB (it solves caching, retry, dedup, placeholders). Manual approach for small or fully-in-memory lists where Paging is overkill.
