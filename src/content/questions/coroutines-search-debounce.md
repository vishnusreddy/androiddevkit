---
question: "Implement search-as-you-type with Flow. Which operators do you use and why?"
topic: coroutines
difficulty: mid
order: 190
starred: false
section: "Practical Flow pipelines"
tags: ["flow", "practical", "debounce", "flatMapLatest"]
---

A clean search pipeline chains a few Flow operators, each solving a specific problem:

```kotlin
val results: StateFlow<SearchState> = queryFlow
    .debounce(300)                  // 1. wait for typing to pause
    .filter { it.length >= 2 }      // 2. ignore tiny queries
    .distinctUntilChanged()         // 3. skip duplicate queries
    .flatMapLatest { query ->       // 4. cancel the previous search
        repository.search(query)
            .map { SearchState.Results(it) }
            .onStart { emit(SearchState.Loading) }
            .catch { emit(SearchState.Error(it.message)) }
    }
    .stateIn(viewModelScope, WhileSubscribed(5000), SearchState.Idle)
```

**Why each operator:**
1. **`debounce(300)`** - don't fire a request on every keystroke; wait until the user pauses. Saves network calls.
2. **`filter`** - skip 0–1 character queries that aren't worth searching.
3. **`distinctUntilChanged`** - if the debounced query equals the last one (e.g. type then backspace), don't repeat the search.
4. **`flatMapLatest`** - when a new query comes in, **cancel** the in-flight search for the old one. This prevents the classic race where a slow response for "ja" arrives *after* "java" and overwrites the correct results.

**`onStart` / `catch`** model loading and error states inside the per-query inner flow.

**This question tests** whether you understand the *race condition* `flatMapLatest` solves - that's the senior-level insight interviewers are listening for, not just naming `debounce`.
