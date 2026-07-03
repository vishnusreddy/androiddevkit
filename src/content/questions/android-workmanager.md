---
question: "When should you use WorkManager?"
topic: android-fundamentals
difficulty: mid
tags: ["workmanager", "background", "scheduling"]
---

**WorkManager** is the recommended API for **persistent, deferrable** background
work. An enqueued request is stored and scheduled to run after its constraints
are met, including across ordinary process death and device reboot.

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
- **Persistent scheduling** - work is stored in a database and rescheduled
  across ordinary app-process death and reboot. It is not an immediate or
  exact-time execution guarantee, and a user force-stop prevents background
  execution until the app is started again.
- **Constraints** - network, charging, battery-not-low, storage, idle.
- **Retry/backoff**, **periodic** work, **chaining** (`beginWith().then()`), unique work, and **observable** status (LiveData/Flow).
- Respects **Doze** and battery limits, picking the right underlying mechanism (JobScheduler, etc.).

**When to use which:**

| Need | Use |
|---|---|
| In-app async while app is alive (load data) | **Coroutines** (`viewModelScope`) |
| Deferrable work that must complete eventually (sync, upload, backup) | **WorkManager** |
| Immediate, ongoing, user-visible task (music, navigation) | **Foreground Service** |
| User-visible action that genuinely requires an exact time | **AlarmManager**, after checking exact-alarm access |

**Key distinctions:**
- **WorkManager ≠ for exact timing** - it means "run after constraints are met,"
  not "run at exactly 9:00." Exact alarms are reserved for genuinely
  user-intentioned precise actions and may require special access; check
  `canScheduleExactAlarms()` and degrade gracefully when it is unavailable.
- **WorkManager ≠ for immediate in-app work** - if the app is in the foreground and you just need async, coroutines are simpler.
- It **supersedes** the old `JobScheduler`/`FirebaseJobDispatcher`/`AlarmManager+Receiver` combos for most background jobs.
