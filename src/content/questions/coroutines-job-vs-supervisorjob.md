---
question: "Job vs SupervisorJob, and coroutineScope vs supervisorScope?"
topic: coroutines
difficulty: mid
tags: ["coroutines", "job", "supervision", "error-handling"]
---

The difference is **how a child's failure affects its siblings and parent**.

**Regular `Job`** - failure propagates **both ways**: a failing child cancels its parent, which cancels all the *other* children. One failure tears down the whole scope.

**`SupervisorJob`** - failure propagates **downward only**: a child failing does **not** cancel its siblings or the parent. Each child fails independently.

```kotlin
// Regular: if one fails, both are cancelled
coroutineScope {
    launch { loadProfile() }   // if this throws...
    launch { loadFeed() }      // ...this gets cancelled too
}

// Supervisor: independent children
supervisorScope {
    launch { loadProfile() }   // can fail alone
    launch { loadFeed() }      // keeps running regardless
}
```

`coroutineScope { }` uses a regular Job; `supervisorScope { }` uses a SupervisorJob. Same relationship as `CoroutineScope(Job())` vs `CoroutineScope(SupervisorJob())`.

**When to use supervision:** a screen loading several independent widgets where one failing shouldn't blank the others; a `viewModelScope`-style scope where one failed operation shouldn't kill all future ones.

**Two gotchas interviewers love:**
1. With `SupervisorJob`, each child needs its **own** exception handling - a `CoroutineExceptionHandler` must be installed on the child `launch`, not just the scope, because the failure doesn't propagate up to the scope's handler in the same way.
2. Putting `SupervisorJob()` *inside* a child `launch(SupervisorJob())` does **not** make its children supervised - supervision comes from the scope's Job, and passing a Job to a builder breaks the parent link. Use `supervisorScope { }` instead.
