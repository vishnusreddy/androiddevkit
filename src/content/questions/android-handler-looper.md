---
question: "Explain Handler, Looper, and MessageQueue. How does the main thread work?"
topic: android-fundamentals
difficulty: mid
tags: ["threading", "handler", "looper", "main-thread"]
---

This trio is the message-passing machinery behind Android's main thread.

- **`MessageQueue`** - a queue of `Message`/`Runnable` tasks to be processed, ordered by time.
- **`Looper`** - an infinite loop bound to a thread that pulls messages off the queue and dispatches them, one at a time. One Looper per thread (`Looper.prepare()` + `Looper.loop()`).
- **`Handler`** - the interface to **post** messages/runnables onto a Looper's queue and to **handle** them when they're dispatched. A Handler is bound to the Looper of the thread that created it (or one you pass).

```kotlin
val mainHandler = Handler(Looper.getMainLooper())
mainHandler.post { textView.text = "Done" }        // run on main thread
mainHandler.postDelayed({ /* ... */ }, 1000)        // schedule for later
```

**The main (UI) thread** *is* a thread running a `Looper`. The framework calls `Looper.loop()` for you; every lifecycle callback, touch event, and `View.invalidate` is a message dispatched through the main `MessageQueue`. That's why:
- **All UI updates must happen on the main thread** - it's the single thread draining that queue.
- **Blocking the main thread** (heavy work in a message) stalls the queue → no frames drawn → **ANR**.
- You "go back to the UI thread" by posting to the main `Handler` (or, in coroutines, `Dispatchers.Main`).

**Where it still matters today:** even though you use coroutines now, `Dispatchers.Main` is built on the main Looper, and `HandlerThread` (a thread with its own Looper) backs some libraries (e.g. camera/sensor callbacks). Understanding it explains *why* `runOnUiThread`, `View.post`, and `Dispatchers.Main` exist.
