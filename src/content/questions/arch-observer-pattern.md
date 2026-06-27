---
question: "Explain the Observer pattern and where it appears in Android."
topic: architecture
difficulty: junior
tags: ["design-patterns", "observer", "reactive"]
---

The **Observer pattern** defines a one-to-many dependency: a **subject** maintains a list of **observers** and notifies them automatically when its state changes. It decouples the producer of data from its consumers.

```kotlin
// The essence: subscribe, get notified on change
interface Observer<T> { fun onChanged(value: T) }
class Subject<T>(initial: T) {
    private val observers = mutableListOf<Observer<T>>()
    var value: T = initial
        set(v) { field = v; observers.forEach { it.onChanged(v) } }
    fun observe(o: Observer<T>) { observers += o }
}
```

**Where it's everywhere in Android:**
- **`LiveData`** - observe and get lifecycle-aware updates.
- **`Flow` / `StateFlow` / `SharedFlow`** - the coroutine-based reactive streams; `collect` is observing.
- **Compose state** - reading a `State` subscribes the composable; writes notify readers (recomposition).
- **`RecyclerView.AdapterDataObserver`**, **click listeners**, `ViewTreeObserver`, `LifecycleObserver`.
- **RxJava** `Observable`/`Observer` - the pattern in its named form.

**Why it matters architecturally:** it's the backbone of **reactive, UDF** apps - the UI **observes** state from the ViewModel and updates automatically, instead of the ViewModel reaching into the UI. This inverts the dependency (UI depends on data, not vice versa).

**Trade-offs to mention:**
- **Lifecycle leaks** - observers not unregistered (or not lifecycle-aware) leak or update dead UI. `LiveData`/`repeatOnLifecycle` solve this.
- **Notification storms / ordering** - too many fine-grained updates can cause churn (hence `distinctUntilChanged`, conflation, `derivedStateOf`).
