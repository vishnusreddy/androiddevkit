---
question: "What are common memory leaks on Android, and how do you detect them?"
topic: android-fundamentals
difficulty: mid
tags: ["memory-leaks", "performance"]
---

A memory leak on Android usually means a **long-lived object holds a reference to a short-lived one** (often an Activity/Fragment/View), preventing GC after it's destroyed.

**The usual culprits:**
- **Inner classes / anonymous listeners / Handlers** holding an implicit reference to the outer Activity, posted with a delay that outlives the Activity. (A `Handler.postDelayed` of 60s pins the Activity.)
- **Static fields / singletons / objects** holding a `Context`, `View`, or callback. Use **application context** for app-lifetime objects.
- **ViewModel holding a View/Activity context** - survives config change, leaks the old Activity.
- **Listeners/observers not unregistered** - `BroadcastReceiver`, `LocationListener`, `LiveData.observeForever`, RxJava/Flow subscriptions, `ViewTreeObserver`.
- **Coroutines in the wrong scope** - `GlobalScope`/unscoped jobs capturing UI.
- **Fragment view leaks** - not nulling `ViewBinding` in `onDestroyView`, or observing with the fragment instead of `viewLifecycleOwner`.
- **Bitmaps / large caches** not bounded or recycled.

**Detection tools:**
- **LeakCanary** - the standard. It watches destroyed Activities/Fragments/ViewModels, triggers a heap dump when one isn't GC'd, and shows the **leak trace** (the reference chain holding it). First thing to add when investigating.
- **Android Studio Memory Profiler** - capture a heap dump, look for retained Activities, inspect references, force GC, and track allocations.
- **StrictMode** can flag some leaks (e.g. unclosed resources).

**The fix pattern:** break the reference chain - use weak references or app context, unregister in the symmetric lifecycle callback, scope coroutines to a lifecycle, and null out view-bound fields on destroy.
