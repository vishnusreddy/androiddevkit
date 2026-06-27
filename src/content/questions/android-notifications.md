---
question: "How do notifications work on modern Android? (channels, importance, permission)"
topic: android-fundamentals
difficulty: mid
tags: ["notifications", "channels"]
---

Posting a notification requires a few things on modern Android:

**1. A notification channel (Android 8+, mandatory).** Every notification belongs to a **channel**; the **user** controls importance, sound, vibration, and can mute a channel — you can't override their choice. Create channels once (e.g. in `Application.onCreate`).
```kotlin
val channel = NotificationChannel(
    "messages", "Messages", NotificationManager.IMPORTANCE_HIGH,
)
notificationManager.createNotificationChannel(channel)
```

**2. Build and post:**
```kotlin
val n = NotificationCompat.Builder(context, "messages")
    .setSmallIcon(R.drawable.ic_msg)
    .setContentTitle("New message")
    .setContentText(body)
    .setContentIntent(pendingIntent)        // tap action (PendingIntent)
    .setAutoCancel(true)
    .build()
NotificationManagerCompat.from(context).notify(id, n)
```

**3. Runtime permission (Android 13+).** `POST_NOTIFICATIONS` is now a **runtime permission** — request it like any dangerous permission; without it, your notifications are silently dropped.

**Key points interviewers want:**
- **Importance** is set on the **channel**, not the notification, and the **user has final say**. `IMPORTANCE_HIGH` = heads-up; `LOW`/`MIN` = quiet.
- **Channel groups**, and you can't change a channel's importance after creation (user owns it).
- **`PendingIntent`** powers tap and action buttons — use `FLAG_IMMUTABLE` (except direct-reply, which needs `MUTABLE`).
- **Rich features**: styles (`BigTextStyle`, `MessagingStyle`, `MediaStyle`), actions, **direct reply** (`RemoteInput`), progress, grouping/summary, and **foreground service** notifications.
- **`NotificationCompat`** for backward compatibility.

**Soundbite:** "Every notification needs a channel (user-controlled importance) since Android 8, and `POST_NOTIFICATIONS` runtime permission since Android 13. Build with `NotificationCompat`, attach an immutable `PendingIntent`, and respect the user's channel settings."
