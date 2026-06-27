---
question: "Design an infinite, image-heavy feed (like Instagram). What are the key client-side decisions?"
topic: system-design
difficulty: senior
tags: ["system-design", "pagination", "caching", "offline"]
---

Drive the discussion through the layers; the interviewer wants trade-offs, not a backend diagram.

**1. Data flow & pagination**
- Use **cursor-based pagination**, not offset - stable as new items are inserted at the top.
- Make the database the **single source of truth**. The Paging 3 library + a `RemoteMediator` writes pages into Room; the UI only ever reads from Room. This gives you offline reads and consistent scroll position for free.

**2. Caching**
- **Disk cache (Room)** for feed metadata, **separate image cache** (Coil/Glide handle memory + disk LRU) for bitmaps.
- Define a **freshness/invalidation** policy: cache-then-network, with pull-to-refresh forcing a revalidation.

**3. Images - usually the real bottleneck**
- Request **server-resized** variants per device density; never download full-res for a thumbnail.
- **Prefetch** a few items ahead based on scroll velocity; **cancel** requests for items scrolled off-screen.
- Decode to the target size to avoid OOM; downsample large images.

**4. Networking**
- Coalesce/limit concurrent requests, retry with backoff, dedupe in-flight calls.

**5. Scroll performance**
- Stable item keys, fixed/known item sizes where possible, avoid heavy work in the bind/compose path, and watch for jank with the recomposition counter or systrace.

**6. Offline & resilience**
- Because Room is the source of truth, the feed renders offline. Queue writes (likes, comments) and reconcile when back online.

**Call out the trade-offs explicitly:** memory vs. smoothness (prefetch distance), freshness vs. data usage (cache TTL), and consistency vs. latency (optimistic UI for likes). Naming the tension is what separates a senior answer from a feature list.
