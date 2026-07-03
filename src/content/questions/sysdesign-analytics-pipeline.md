---
question: "Design an analytics / event tracking pipeline for a mobile app."
topic: system-design
difficulty: senior
order: 50
starred: true
section: "SDK and library design"
tags: ["system-design", "analytics", "batching", "workmanager"]
---

**Requirements:** capture events with a defined reliability target, retain them
through offline periods and ordinary process restarts, and keep logging off the
UI's critical path. Absolute zero loss is not realistic: the process can die
before an asynchronous write completes, storage can fail, and a bounded queue
must eventually evict data.

**The core principle: never send one network request per event.** That would hammer the radio (battery), waste data, and add latency. Instead **persist then batch**.

**Pipeline:**
![Analytics pipeline from local persistence through batching, upload, and acknowledgement](/diagrams/analytics-pipeline.svg)

1. **Capture** - `track(event)` validates a small immutable payload and enqueues
   it to a single writer without network or blocking I/O on the main thread.
   Define what happens if the in-memory handoff is full rather than silently
   allocating forever.
2. **Persist** - the writer stores events in **Room** or an append-only file so
   completed writes survive process death. Events still in memory at the exact
   instant of a crash may be lost; truly critical business actions belong in a
   transactional product database, not only analytics.
3. **Batch & flush** - upload events in **batches** when:
   - the batch reaches a size threshold (e.g. 50 events), **or**
   - a time interval elapses, **or**
   - the app goes to background, **or**
   - connectivity returns.
   Use **WorkManager** with a network constraint and backoff when the flush must
   survive process loss. The OS may defer work, and users or the app can cancel
   it, so also flush opportunistically while the process is alive.
4. **Acknowledge & clear** - on successful upload, delete sent events. Use a **batch id / idempotency** so a retried upload doesn't duplicate (server dedups).

**Reliability details:**
- **Offline** - events accumulate locally and flush on reconnect.
- **At-least-once** delivery with **server-side dedup** (event UUIDs) - simpler and safer than exactly-once.
- **Bounded queue** - cap size / drop oldest low-priority events if the queue grows unbounded (offline for days).
- **Crash recovery** - flush persisted events on the next launch and accept the
  documented loss window between API call and durable write.

**Other concerns:** **enrich** events with common context (session, app version, device) once; **sampling** for high-volume events; **privacy/consent** (don't log PII; respect opt-out); **schema/versioning** of event payloads; **compression** of batches.

**Trade-offs to name:** batch size/interval (freshness of analytics vs battery/data), at-least-once + dedup (simplicity vs duplicate handling), queue cap (completeness vs storage), sampling (volume/cost vs fidelity).
