---
question: "What causes an ANR, and how do you prevent and diagnose one?"
topic: android-fundamentals
difficulty: mid
tags: ["anr", "performance", "main-thread"]
---

An **ANR (Application Not Responding)** happens when the **main thread is blocked** too long and can't process input or draw. The system thresholds:
- **~5 seconds** — input event (touch/key) not handled.
- **~10 seconds** — `BroadcastReceiver.onReceive` not finished (foreground).
- **Service / `ContentProvider`** timeouts and (Android 11+) `onStartForeground` not called in time.

**Common causes:**
- Heavy work on the main thread — **network, disk/database I/O, big JSON parsing, bitmap decoding**.
- **Blocking calls** — `Thread.sleep`, synchronous network, `runBlocking` on Main, a lock held by a slow thread.
- **Deadlocks** between the main thread and a background lock.
- Doing too much in lifecycle callbacks or `onReceive`.
- A janky main thread under load (binder calls, too many/large frames).

**Prevention:**
- Move all I/O and CPU work off Main — **coroutines with `Dispatchers.IO`/`Default`**, `WorkManager` for background.
- Keep frame work under **16ms** (60fps); avoid synchronous work in `onCreate`/`onBind`/`onReceive`.
- Use **`StrictMode`** in debug to catch accidental disk/network on the main thread.
- Use `goAsync()` or hand off in receivers; don't block.

**Diagnosis:**
- **`/data/anr/traces.txt`** (or the bug report) shows the main-thread stack at the moment of the ANR — read it to find what was blocking.
- **Play Console → Android vitals** aggregates ANR rate in production with stacks.
- **Perfetto / systrace / Macrobenchmark** and the **CPU profiler** to find main-thread stalls.

**Soundbite:** "ANR = blocked main thread past ~5s (input)/~10s (receiver). Cause is almost always I/O or heavy work on Main; fix by offloading to coroutines/WorkManager, catch it early with StrictMode, and diagnose with ANR traces and Android vitals."
