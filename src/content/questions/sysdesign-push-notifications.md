---
question: "Design the push notification system for a mobile client (FCM)."
topic: system-design
difficulty: mid
order: 90
starred: false
section: "Sync and real-time"
tags: ["system-design", "fcm", "notifications", "push"]
---

**Flow overview:** App registers with **FCM** → gets a **device token** → sends it to your backend → backend sends messages to FCM addressed by token → FCM delivers to the device → your app shows a notification or syncs.

**Client responsibilities:**

**1. Token management**
- On `onNewToken`, **upload the token** to your backend (associated with the user/device). Tokens **rotate** (reinstall, restore, refresh) - always sync the latest.
- Remove/invalidate tokens on **logout** so the next user doesn't get the previous user's pushes.

**2. Message types (the key design choice):**
- **Notification messages** - FCM displays them automatically when backgrounded; limited control.
- **Data messages** - delivered to your `onMessageReceived` (foreground; background with caveats), giving you **full control** to build the notification or trigger a sync.
- Choose **notification messages** when the platform-rendered background
  notification is sufficient. Choose **data messages** when the client needs
  custom handling, while accounting for background-delivery limits. For
  important data, treat either message as a signal and reconcile with the
  source of truth rather than trusting an unordered, size-limited payload.

**3. Displaying & handling**
- Build with `NotificationCompat` on the right **channel** (user-controlled importance); attach an **immutable `PendingIntent`** with a **deep link** to the relevant screen.
- Request **`POST_NOTIFICATIONS`** runtime permission (Android 13+).
- **Deduplicate** with the socket/in-app path (don't double-notify), and **collapse** related notifications (group + summary, or `collapseKey`).

**4. Reliability & priority**
- **High-priority** messages can wake the app from Doze for time-sensitive pushes (use sparingly - abuse gets throttled).
- FCM delivery is **best-effort**, not guaranteed/instant/ordered - design for missed/late pushes (sync on next open).
- **WorkManager** to do any heavy work the push triggers (don't do it in `onMessageReceived`, which has a ~10s budget).

**Trade-offs to name:** data vs notification messages (control vs simplicity), high-priority (timeliness vs battery/throttling), push-as-signal vs push-as-payload (reliability vs latency).
