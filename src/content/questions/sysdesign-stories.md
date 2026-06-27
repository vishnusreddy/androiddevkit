---
question: "Design an Instagram/WhatsApp Stories feature."
topic: system-design
difficulty: senior
tags: ["system-design", "media", "prefetch", "ui"]
---

Stories test **media prefetching, smooth transitions, and ephemeral state**.

**Requirements:** horizontal tray of users with stories; tap to view full-screen; auto-advance through a user's segments; swipe to next user; images + videos; seen/unseen state; expire after 24h.

**Data model:**
```
stories(userId, segments[], expiresAt)
segment(id, type=IMAGE|VIDEO, url, duration, seenAt?)
```
- **Room** caches the tray + seen state (works offline, instant tray render).
- **Seen state** persisted locally and synced to the server.

**The make-or-break: prefetching for instant playback.**
- When the tray loads, **prefetch the first segment** of the first few users' stories.
- While viewing user N, **prefetch user N+1's** first segment (and the next segment of the current user). Viewers expect zero load time on tap/advance.
- Use the image library (Coil) for image prefetch and ExoPlayer preloading for video; cap concurrency and **cancel** prefetch for users scrolled away.

**Playback & UX:**
- Full-screen pager (`HorizontalPager`) of users; within a user, a segment progress indicator that **auto-advances** on a timer (images) or on video completion.
- **Gestures:** tap right/left = next/prev segment, long-press = pause, swipe down = dismiss, swipe horizontal = next user.
- Preload the **next segment's** media before the current finishes so transitions are seamless.

**Media handling:**
- Images: downsample to screen size; videos: ExoPlayer with a small buffer (segments are short), hardware decode.
- Show a subtle loading state only if prefetch missed.

**Lifecycle & ephemerality:**
- Pause on background (`repeatOnLifecycle`); resume position.
- **Expire** stories after 24h - clean up cache; don't show expired.
- Upload own story via resumable/chunked upload with optimistic "posting" state.

**Trade-offs to name:** prefetch depth (instant UX vs data/battery/memory - prefetching everyone's stories wastes data), buffer size for video, cache retention vs storage, eager vs lazy seen-sync.
