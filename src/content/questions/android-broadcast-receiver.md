---
question: "What is a BroadcastReceiver, and what changed with background restrictions?"
topic: android-fundamentals
difficulty: mid
tags: ["broadcast-receiver", "components", "background"]
---

A **BroadcastReceiver** responds to system-wide or app **broadcast** events (connectivity change, boot completed, battery low, or your own custom broadcasts).

**Two ways to register:**
- **Manifest-declared (static)** - listens even when the app isn't running. Since **Android 8**, most **implicit** system broadcasts can **no longer** be declared in the manifest (to curb apps waking up constantly). A few exceptions remain (e.g. `BOOT_COMPLETED`, `LOCKED_BOOT_COMPLETED`).
- **Context-registered (dynamic)** - `registerReceiver()` in code; only active while your component is alive. You **must** `unregisterReceiver()` (e.g. in `onStop`/`onDestroy`) or you leak.

```kotlin
val receiver = object : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) { /* handle */ }
}
// API 33+: must specify exported flag
registerReceiver(receiver, IntentFilter(ACTION), RECEIVER_NOT_EXPORTED)
```

**Key constraints interviewers probe:**
- **`onReceive` runs on the main thread** and must return **quickly** (~10s limit) - no heavy work. Hand off long tasks to **WorkManager** or a `goAsync()` + coroutine, not a raw thread.
- **Android 8+ background limits** - prefer **WorkManager/JobScheduler** over receivers for background reactions; manifest receivers for implicit broadcasts are mostly disallowed.
- **Security** - declare `exported` correctly (required flag on API 33+), use permissions on sensitive broadcasts, and prefer **`LocalBroadcastManager` is deprecated** → use a `SharedFlow`/observer pattern for in-app events instead of broadcasts.

**Modern guidance:** for in-app eventing use Flows; for reacting to system conditions (network, charging) prefer **WorkManager constraints**; reserve receivers for the few cases that genuinely need them (e.g. `BOOT_COMPLETED` to reschedule work).
