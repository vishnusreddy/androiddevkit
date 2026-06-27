---
question: "What are the different types of Context, and when do you use each?"
topic: android-fundamentals
difficulty: mid
tags: ["context", "memory-leaks"]
---

`Context` is the handle to app/system resources and services. The main flavors:

- **Application context** — tied to the **app's lifetime**. Get it via `applicationContext` / `getApplication()`. Use for things that must outlive any single screen: singletons, databases, WorkManager, `DataStore`, app-wide managers.
- **Activity context** — tied to **one Activity's lifetime**. Carries theme/config. Use for **UI work**: inflating layouts, starting activities, showing dialogs, theming.
- **Service / BroadcastReceiver context** — scoped to those components.

**The golden rule — match the context's lifetime to the object that holds it:**

```kotlin
// ✅ singleton holds app context — same lifetime, no leak
class Analytics(context: Context) {
    private val appContext = context.applicationContext
}

// ❌ singleton (or static/ViewModel) holding an Activity context → leaks the Activity
object Cache { lateinit var ctx: Context }   // if assigned an Activity, it leaks
```

**Why it matters:** holding an **Activity** context in something longer-lived (a static field, singleton, ViewModel, or a long-running thread) prevents the Activity from being garbage-collected after it's destroyed — a classic **memory leak**.

**Things that need a specific context:**
- **Dialogs / theming / inflation** → need an **Activity** (or themed) context; the app context lacks the right theme and can crash/misrender.
- **Toasts, system services, resources** → app context is fine.

**Soundbite:** "Use the application context for app-lifetime objects and the Activity context for UI; never let a long-lived object hold an Activity context — that's the textbook leak."
