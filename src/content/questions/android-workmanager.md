---
question: "When should you use WorkManager?"
topic: android-fundamentals
difficulty: mid
tags: ["workmanager", "background", "scheduling"]
---

**WorkManager** is the recommended API for **deferrable, guaranteed** background work - tasks that must run **eventually**, even across app restarts and device reboots.

```kotlin
val work = OneTimeWorkRequestBuilder<UploadWorker>()
    .setConstraints(Constraints.Builder()
        .setRequiredNetworkType(NetworkType.CONNECTED)
        .setRequiresCharging(true)
        .build())
    .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, 10, TimeUnit.SECONDS)
    .build()
WorkManager.getInstance(context).enqueue(work)
```

What it gives you:
- **Guaranteed execution** - persisted to a DB; survives app death and reboot.
- **Constraints** - network, charging, battery-not-low, storage, idle.
- **Retry/backoff**, **periodic** work, **chaining** (`beginWith().then()`), unique work, and **observable** status (LiveData/Flow).
- Respects **Doze** and battery limits, picking the right underlying mechanism (JobScheduler, etc.).

**When to use which:**

| Need | Use |
|---|---|
| In-app async while app is alive (load data) | **Coroutines** (`viewModelScope`) |
| Deferrable work that must complete eventually (sync, upload, backup) | **WorkManager** |
| Immediate, ongoing, user-visible task (music, navigation) | **Foreground Service** |
| Exact-time alarm (calendar reminder) | **AlarmManager** (`setExactAndAllowWhileIdle`) |

**Key distinctions:**
- **WorkManager ≠ for exact timing** - it's "run when constraints are met, eventually," not "run at exactly 9:00." For precise alarms use `AlarmManager`.
- **WorkManager ≠ for immediate in-app work** - if the app is in the foreground and you just need async, coroutines are simpler.
- It **supersedes** the old `JobScheduler`/`FirebaseJobDispatcher`/`AlarmManager+Receiver` combos for most background jobs.
