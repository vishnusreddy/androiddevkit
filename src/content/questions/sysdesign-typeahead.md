---
question: "Design a search / typeahead (autocomplete) feature."
topic: system-design
difficulty: mid
tags: ["system-design", "search", "flow", "debounce"]
---

**Requirements:** suggestions as the user types, fast, tolerant of slow networks, no wasted requests, no stale results.

**The client pipeline (this is also a coroutines/Flow question):**
```kotlin
queryFlow
    .debounce(300)                 // wait for a typing pause
    .filter { it.length >= 2 }     // skip tiny queries
    .distinctUntilChanged()        // skip duplicate queries
    .flatMapLatest { q ->          // cancel the previous in-flight search
        searchRepository.search(q)
            .onStart { emit(Loading) }
            .catch { emit(Error) }
    }
    .collect { render(it) }
```

**Why each operator:**
- **`debounce`** - don't fire on every keystroke; one request per typing pause. Saves network/battery.
- **`distinctUntilChanged`** - type then backspace to the same text → no repeat search.
- **`flatMapLatest`** - **cancel the stale search** when a newer query arrives. Fixes the classic race: a slow response for "ja" must not overwrite results for "java".

**Caching & performance:**
- **Cache recent query results** (LRU) so re-typing a query is instant and offline-tolerant.
- **Local index** for some sources - recent searches, contacts, on-device data via a Room **FTS** table → instant local suggestions merged with remote.
- **Prefetch / warm** popular queries.

**Ranking & UX:**
- Merge **local** (recent/history) + **remote** suggestions; rank by relevance/recency.
- Highlight the matched substring; show recent searches when the box is empty.
- Debounce-tuned for feel (200–400ms); show a subtle loading state, not a blocking spinner.

**Backend-ish considerations (mention briefly):** server-side prefix index (trie/Elasticsearch) - but the **client** focus is debounce, cancellation, caching, and merging local+remote.

**Trade-offs to name:** debounce delay (responsiveness vs request count), min query length, local vs remote suggestions (instant/offline vs coverage), cache size, prefetch popular queries (instant vs wasted work).
