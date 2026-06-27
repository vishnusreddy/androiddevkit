---
question: "How do you design an app to handle poor or intermittent connectivity?"
topic: system-design
difficulty: mid
tags: ["system-design", "offline", "networking", "resilience"]
---

Treat the network as **unreliable by default** - this is the defining constraint of mobile vs web. Design so the app stays usable on a flaky train-Wi-Fi connection.

**Offline-first foundation:**
- **Local DB (Room) as the single source of truth.** The UI reads from the DB, so it **always has data** to show - network is an *enhancement*, not a requirement.
- **Optimistic UI** - apply user actions locally immediately (mark `PENDING`), sync in the background; reconcile on success/failure.

**Queue writes, sync later:**
- An **outbox** of pending mutations persisted in the DB.
- Drain it with **WorkManager** (network constraint) when connectivity returns - **guaranteed**, survives app kill/reboot.
- Make syncs **idempotent** (client-generated IDs) so retries don't duplicate.

**Smart networking:**
- **Retry with exponential backoff + jitter** for transient failures; cap attempts.
- **Timeouts** tuned for mobile (don't hang forever); distinguish "slow" from "failed."
- **Request dedup / coalescing**; **cancel** on screen leave.
- **Conditional requests (ETag)** and **delta sync** to minimize data over weak links.
- Detect connectivity with **`NetworkCallback`** (and *quality*, not just connected - captive portals/validated capability).

**UX for degraded states:**
- Show **cached content** immediately; subtle "offline" / "last updated X" indicators.
- **Don't block** the UI on the network; never show a blank screen because a request is pending.
- Clear **retry** affordances; pause-and-resume for transfers.
- Graceful partial failures (one widget fails, the rest render).

**Resilience details:**
- Handle **mid-request drops** (resume via `Range`/resumable uploads).
- **Data Saver / metered** awareness - defer heavy syncs to Wi-Fi.
- Avoid thundering-herd reconnects (jittered backoff).

**Trade-offs to name:** optimistic UI (responsiveness vs reconciling failures), aggressive retry (success vs battery/data), sync frequency (freshness vs cost), cache staleness vs availability.
