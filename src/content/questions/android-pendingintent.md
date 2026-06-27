---
question: "What is a PendingIntent, and why do the mutability flags matter?"
topic: android-fundamentals
difficulty: mid
tags: ["pendingintent", "security", "notifications"]
---

A **PendingIntent** is a token that wraps an `Intent` **plus your app's permission to perform it**, handed to **another app or the system** so they can execute the action **as you, later**. It's used for **notifications**, **alarms** (`AlarmManager`), app **widgets**, and `Service`/`Activity` callbacks.

```kotlin
val pi = PendingIntent.getActivity(
    context, requestCode, intent,
    PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
)
notificationBuilder.setContentIntent(pi)
```

**Why mutability is a security issue:** the receiving app holds your PendingIntent and could **fill in the blank fields** of the wrapped Intent if it's *mutable*, then have it executed with **your** app's identity/permissions. A mutable PendingIntent with an unspecified component is an **intent-redirection** vulnerability.

The flags:
- **`FLAG_IMMUTABLE`** - the other app **can't modify** the Intent. **Default choice** - use it unless you have a specific reason not to. **Required** thinking on Android 12+ (you must explicitly pass `IMMUTABLE` or `MUTABLE`).
- **`FLAG_MUTABLE`** - allows modification. Only when a system feature **needs** to fill in data - e.g. **direct reply** notifications (the system inserts the typed text), or Bubbles. When you do, make the Intent **explicit** (named component) to avoid redirection.
- **`FLAG_UPDATE_CURRENT`** - update the extras of an existing matching PendingIntent.
- **`FLAG_CANCEL_CURRENT` / `FLAG_NO_CREATE` / `FLAG_ONE_SHOT`** - manage lifecycle/reuse.

**Equality gotcha:** PendingIntents are matched by `requestCode` + Intent (action/data/component, **not** extras). Reusing the same requestCode can hand back an old one - vary the requestCode or use `UPDATE_CURRENT` for notifications.
