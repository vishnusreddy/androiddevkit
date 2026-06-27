---
question: "What are the types of Services? Started vs bound vs foreground, and the modern alternatives."
topic: android-fundamentals
difficulty: mid
tags: ["services", "background", "components"]
---

A **Service** runs without a UI. Three usage patterns:

**Started service** - launched with `startService`/`startForegroundService`, runs until it stops itself (`stopSelf`) or is stopped. For ongoing work not tied to a UI.

**Bound service** - components `bindService` to get a client-server interface (`IBinder`) and call into it. Lives while clients are bound; great for in-process APIs (e.g. a media playback controller).

**Foreground service** - a started service that shows a **persistent notification** and is far less likely to be killed. **Required** for user-visible ongoing work (music, navigation, active location, calls). On Android 14+ you must declare a **`foregroundServiceType`** and have a matching permission/justification.

```kotlin
val notification = buildNotification()
startForeground(ID, notification, FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK)
```

**The big modern caveat - background limits.** Since Android 8 (Oreo), apps can't freely run background services; the system kills them. So:

- **Deferrable, guaranteed background work** (sync, upload, periodic jobs) → **`WorkManager`**, not a Service.
- **In-app async work** while the app is alive → **coroutines** (`viewModelScope`), not a Service.
- **Services are now reserved** for genuinely *immediate, ongoing, user-aware* work - and then almost always **foreground** services.

**Other points:**
- A Service runs on the **main thread** by default - you must offload work to a background thread/coroutine yourself (it's not automatically backgrounded).
- `onStartCommand` return value (`START_STICKY` etc.) controls restart behavior after the system kills it.
