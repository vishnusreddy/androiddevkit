---
question: "Design a news / article reader app with offline reading."
topic: system-design
difficulty: mid
tags: ["system-design", "offline", "caching", "sync"]
---

**Requirements:** browse a feed of articles, read full content, **read offline**, sync read/bookmark state, images, periodic refresh.

**Offline-first data layer (the centerpiece):**
- **Room is the single source of truth.** The UI observes Room `Flow`s, so the feed and saved articles render instantly and **work offline**.
- Schema: `articles(id, title, summary, body, imageUrl, publishedAt, isRead, isBookmarked, cachedAt)`.
- Network fetches **write into Room**; the UI never reads the network directly.

**Sync strategy:**
- **Cache-then-network** - show cached feed immediately, refresh in background, update.
- **Background refresh** - **WorkManager periodic** job (constraints: unmetered + maybe charging) pulls latest headlines so content is fresh when the user opens the app, even offline.
- **Delta sync** with a timestamp/cursor to fetch only new articles.
- **Prefetch full article bodies + images** for the top N feed items (and bookmarked ones) so they're readable offline - on Wi-Fi to save data.

**Read & bookmark state:**
- Stored locally (instant), synced to the server (delta). Optimistic updates; reconcile on sync.

**Pagination:** cursor-based, load older on scroll, `RemoteMediator` to page from Room.

**Images:** Coil with disk cache; **prefetch** thumbnails with the feed and the hero image for prefetched articles; downsample to view size.

**UX:** "saved for offline" indicator, last-updated time, pull-to-refresh, graceful offline banner.

**Other concerns:** **cache eviction** (cap stored articles / TTL cleanup of old cached bodies to bound storage), **content formatting** (sanitized HTML/markdown rendering), **analytics** (reads, dwell time, batched).

**Trade-offs to name:** how much to prefetch for offline (readability vs storage/data), refresh frequency (freshness vs battery/data), cache retention (offline availability vs storage), eager body prefetch vs on-demand.
