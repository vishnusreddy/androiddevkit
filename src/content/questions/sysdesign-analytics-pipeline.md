---
question: "Design an analytics / event tracking pipeline for a mobile app."
topic: system-design
difficulty: senior
tags: ["system-design", "analytics", "batching", "workmanager"]
---

**Requirements:** track user events reliably, don't drop events (even offline / on crash), minimal battery/data/perf impact, no jank from logging.

**The core principle: never send one network request per event.** That would hammer the radio (battery), waste data, and add latency. Instead **persist then batch**.

**Pipeline:**
```
track(event) → enqueue to local DB → batch → upload → clear sent
```

1. **Capture** - `track(event)` is **fire-and-forget and fast** (no main-thread work, no network). It just writes the event to a local **queue**.
2. **Persist** - store events in **Room** (or a file) so they **survive process death and crashes** - critical for not losing data and for capturing crash-adjacent events.
3. **Batch & flush** - upload events in **batches** when:
   - the batch reaches a size threshold (e.g. 50 events), **or**
   - a time interval elapses, **or**
   - the app goes to background, **or**
   - connectivity returns.
   Use **WorkManager** (network constraint, backoff) so flushes are guaranteed and battery-friendly.
4. **Acknowledge & clear** - on successful upload, delete sent events. Use a **batch id / idempotency** so a retried upload doesn't duplicate (server dedups).

**Reliability details:**
- **Offline** - events accumulate locally and flush on reconnect.
- **At-least-once** delivery with **server-side dedup** (event UUIDs) - simpler and safer than exactly-once.
- **Bounded queue** - cap size / drop oldest low-priority events if the queue grows unbounded (offline for days).
- **Crash safety** - because events are persisted immediately, a crash doesn't lose the trail; flush on next launch.

**Other concerns:** **enrich** events with common context (session, app version, device) once; **sampling** for high-volume events; **privacy/consent** (don't log PII; respect opt-out); **schema/versioning** of event payloads; **compression** of batches.

**Trade-offs to name:** batch size/interval (freshness of analytics vs battery/data), at-least-once + dedup (simplicity vs duplicate handling), queue cap (completeness vs storage), sampling (volume/cost vs fidelity).
