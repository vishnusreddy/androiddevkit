---
question: "What is the Application class, and what should (and shouldn't) you do in it?"
topic: android-fundamentals
difficulty: junior
tags: ["application", "startup", "lifecycle"]
---

The **`Application`** object is a **singleton** created **before any Activity/Service**, living for the whole process lifetime. It's the global entry point and the holder of application-wide state.

```kotlin
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        // app-wide, must-happen-early init
    }
}
```
Register it in the manifest (`<application android:name=".MyApp">`).

**Legitimate uses:**
- **Critical, early initialization** - crash reporting, DI graph (Hilt generates `Application` integration), logging.
- A safe source of **application context** for app-lifetime objects.
- `ProcessLifecycleOwner` / `registerActivityLifecycleCallbacks` for **app-wide foreground/background** awareness.

**What NOT to do (the important part - `onCreate` runs on every cold start and blocks the first frame):**
- **No heavy/synchronous work** - network, disk, big SDK init on the main thread here directly slows **cold start** and risks ANR. **Lazy-init** non-critical SDKs (or use the **App Startup** library) instead.
- **Don't store mutable global state** as a substitute for proper architecture - it's not a dumping ground for "global variables."
- **Don't assume it survives process death** with in-memory state - the process can be recreated; persist what must survive.

**What to remember:**
- It's a **singleton** tied to the **process** - and there can be multiple processes (`android:process`), each with its own `Application` instance.
- Keep `onCreate` **lean**; defer everything you can - startup time is a real metric (Android vitals).
- Prefer **Hilt/DI** and the **App Startup** library over manual init soup.
