---
question: "How do you use prefetching and predictive loading to make an app feel instant?"
topic: system-design
difficulty: mid
tags: ["system-design", "prefetch", "performance", "ux"]
---

**Prefetching** loads data/media **before the user asks**, so the next screen or item appears instantly. The art is **predicting accurately** without wasting data/battery.

**Where to prefetch:**
- **List scrolling** - load the next page **before** the user reaches the end (prefetch distance), so scrolling never stalls. Paging 3's `prefetchDistance` does this.
- **Images/media** - preload images for items just below the fold; in Stories/feeds, prefetch the **next item's** media.
- **Likely next screen** - when a feed loads, prefetch detail data for the **top items** the user is likely to tap.
- **Predictable navigation** - on a product list, prefetch the first detail; on a wizard, prefetch the next step.
- **App open** - warm caches / refresh feed in the background (WorkManager) so content is ready on launch.

**Making predictions smart:**
- Use **scroll direction & velocity** to decide how far ahead to fetch.
- **Heuristics / ML signals** - recently viewed, popularity, user patterns.
- **Cancel** prefetches that become irrelevant (user scrolled past / navigated away) to reclaim bandwidth.

**Guardrails (so prefetch doesn't backfire):**
- **Respect network type** - prefetch aggressively on **Wi-Fi/charging**, conservatively or not at all on **metered/Data Saver**.
- **Bound concurrency & memory** - too much prefetch causes OOM, jank, and cache thrash.
- **Prioritize** visible content over prefetch (don't starve the current screen's requests).
- **Low priority** requests so prefetch yields to user-initiated ones.

**Trade-offs to name (this is the crux):** **instant UX vs wasted data/battery/memory.** Over-prefetching a feed the user abandons burns their data plan; under-prefetching causes loading spinners. Tune prefetch depth to confidence in the prediction and the cost of being wrong, and gate it on network/battery.
