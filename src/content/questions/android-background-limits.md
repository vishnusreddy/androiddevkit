---
question: "How does Doze mode and background execution limits affect your app?"
topic: android-fundamentals
difficulty: senior
tags: ["doze", "background", "battery"]
---

Android has steadily tightened **background execution** to save battery. The major mechanisms:

**Doze mode** (Android 6+) — when the device is **unplugged, stationary, and screen off** for a while, the system enters Doze: it **batches** and **defers** background work into periodic **maintenance windows**. During Doze:
- Network access is **suspended** for apps (except during windows).
- **Wakelocks ignored**, alarms deferred (`AlarmManager` non-exact), jobs/syncs deferred.
- **App Standby** does the same for individual unused apps.

**Background service limits** (Android 8+) — apps in the background **can't start background services**; the system kills them shortly after the app leaves the foreground. Implicit broadcasts are mostly disallowed in the manifest.

**Background location limits** (Android 8/10+) — background apps get location updates only a few times per hour; background access needs a **separate permission**.

**App Standby Buckets** (Android 9+) — the system buckets apps (active / working set / frequent / rare / restricted) by usage and throttles their jobs/alarms accordingly.

**How to work *with* the system (not fight it):**
- **WorkManager** for deferrable background work — it respects Doze/buckets and runs in maintenance windows.
- **FCM high-priority messages** to wake the app for genuinely time-sensitive pushes (temporarily exempt from Doze).
- **`setExactAndAllowWhileIdle`** for true alarms (calendar) — used sparingly.
- **Foreground service** (with notification) for ongoing user-visible work that must run now.

**What to avoid:** holding wakelocks, polling, or expecting precise background timing — the OS will defer or kill it. Requesting **battery-optimization exemption** is heavily restricted by Play and should be a last resort.

**Soundbite:** "Doze/App Standby/background-service limits defer or block background work to save battery. Design *with* them: WorkManager for deferrable jobs, FCM high-priority to wake for urgent pushes, foreground services for ongoing visible work, exact alarms only when truly needed."
