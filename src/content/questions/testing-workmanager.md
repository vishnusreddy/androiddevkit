---
question: "How do you test WorkManager and a CoroutineWorker?"
topic: testing-quality
difficulty: mid
order: 80
starred: false
section: "Data and network boundaries"
tags: ["testing", "workmanager", "coroutines", "background-work"]
---

Separate the worker's business operation from WorkManager scheduling. A thin
`CoroutineWorker` should parse input, call an injected use case, and translate
the result to `Result.success()`, `retry()`, or `failure()`. Unit-test the use
case normally, then test the worker contract with `work-testing`.

```kotlin
class SyncWorker(
    appContext: Context,
    params: WorkerParameters,
    private val sync: SyncPendingChanges,
) : CoroutineWorker(appContext, params) {
    override suspend fun doWork(): Result = when (sync()) {
        SyncResult.Done -> Result.success()
        SyncResult.TransientFailure -> Result.retry()
        SyncResult.PermanentFailure -> Result.failure()
    }
}
```

Use `TestListenableWorkerBuilder` or the appropriate worker test builder to run
the implementation with controlled inputs and dependencies. Verify output data
and each result class. For scheduling integration, initialize WorkManager in
test mode with `WorkManagerTestInitHelper` and use its `TestDriver` to mark
constraints, initial delays, or periodic intervals as satisfied. Do not wait for
real time or network state.

Important cases include duplicate execution, cancellation, retryable versus
permanent errors, input validation, backoff policy, unique-work behavior, and
process restart. Workers may run more than once, so the underlying operation
must be idempotent. A test that runs the same worker twice is often more valuable
than another happy-path assertion.
