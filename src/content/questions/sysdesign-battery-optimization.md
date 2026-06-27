---
question: "How do you minimize battery and data usage in a mobile app?"
topic: system-design
difficulty: mid
tags: ["system-design", "battery", "performance", "data"]
---

Battery and data are first-class constraints in mobile design. The biggest drains are the **radio (network), GPS, wakelocks, and the screen/CPU**.

**Network (the #1 lever - the radio is expensive):**
- **Batch and coalesce** requests - waking the radio repeatedly costs more than one larger transfer (the radio stays in a high-power state for seconds after each use - the "tail energy" problem).
- **Defer** non-urgent work to **WorkManager** with constraints (charging, unmetered Wi-Fi) so it runs in efficient windows.
- **Cache** aggressively; use **ETags/delta sync** to avoid redundant downloads.
- **Compress** payloads; fetch only needed fields.

**Location:**
- Lower **priority/accuracy** and **interval** to the minimum the feature needs (`BALANCED_POWER` vs `HIGH_ACCURACY`); use **geofencing/activity recognition** instead of constant polling; stop updates when not needed.

**Background work:**
- Respect **Doze / App Standby** - don't fight them; use WorkManager/FCM which the system optimizes.
- **Avoid wakelocks**; if unavoidable, hold them as briefly as possible.
- No polling loops; prefer **push (FCM)** over periodic checks.

**CPU / rendering:**
- Avoid jank and unnecessary work (efficient Compose recomposition, no work in `onDraw`); offload heavy compute to `Dispatchers.Default`.
- Hardware-accelerated media decode.

**Data-specific:**
- **Data Saver / metered** awareness - reduce quality, defer prefetch on cellular.
- **Prefetch on Wi-Fi/charging** only; cap image/video resolution on cellular.

**Measure:**
- **Battery Historian**, **Android vitals** (excessive wakeups, wakelocks, background usage), **Network Profiler**, **JankStats/Macrobenchmark**. Optimize from data, not guesses.

**Trade-offs to name:** batching (efficiency vs freshness/latency), location accuracy vs battery, prefetch (instant UX vs data/battery), real-time sockets vs push (timeliness vs drain).
