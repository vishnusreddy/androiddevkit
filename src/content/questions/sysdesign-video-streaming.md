---
question: "Design a video streaming client (like YouTube/Netflix). What are the key client decisions?"
topic: system-design
difficulty: senior
tags: ["system-design", "video", "streaming", "media"]
---

The client cares about **smooth playback under variable networks**, not transcoding (that's backend).

**Requirements:** play video, minimal buffering, adapt to changing bandwidth, scrubbing, prefetch, maybe offline downloads.

**Adaptive Bitrate Streaming (ABR) - the core concept:**
- Video is encoded server-side at **multiple bitrates/resolutions**, split into small **segments** (2–10s), described by a **manifest** (**HLS** `.m3u8` or **DASH** `.mpd`).
- The client **measures available bandwidth** and **buffer level**, then picks the segment quality for the *next* chunk - stepping down on a slow network to avoid stalls, up when bandwidth allows.
- Use **ExoPlayer (Media3)**, which implements ABR, buffering, and HLS/DASH out of the box - don't reinvent it.

**Buffering strategy:**
- Maintain a **buffer ahead** (e.g. 10–30s). Start playback once enough is buffered (fast start = lower initial quality, then ramp up).
- Balance buffer size: **bigger** = fewer stalls but more wasted data if the user abandons; **smaller** = less waste but more rebuffer risk.

**Performance & UX:**
- **Prefetch** the first segments of likely-next videos (autoplay/next-in-list).
- **Preload manifest + first segment** on hover/focus for instant start.
- **Scrubbing** - request the segment at the seek position (and thumbnails track for the seek bar).
- Hardware **decoding** (MediaCodec) for efficiency/battery; `SurfaceView` for rendering.

**Offline downloads:** download selected quality segments to disk (ExoPlayer DownloadManager), DRM license handling, expiry; resume via `Range`.

**Other concerns:** **DRM** (Widevine) for protected content, **CDN** selection, **analytics** (startup time, rebuffer ratio, bitrate - key quality metrics), **battery/data** (Wi-Fi-only downloads, data-saver capping resolution).

**Trade-offs to name:** buffer size (smoothness vs wasted data), aggressive quality (sharpness vs rebuffering), prefetch (instant start vs data/battery), startup quality (fast start vs initial blurriness).
