---
question: "Design a music streaming client (like Spotify) with offline support."
topic: system-design
difficulty: senior
tags: ["system-design", "audio", "streaming", "offline", "media"]
---

**Requirements:** stream audio with instant playback, gapless transitions, prefetch the next track, background playback, offline downloads, lock-screen controls.

**Playback engine:**
- **ExoPlayer (Media3)** for streaming + buffering + format support.
- **`MediaSessionService`** (Media3) so playback runs as a **foreground service** that survives backgrounding, with **`MediaSession`** for lock-screen/notification/Bluetooth/Android Auto controls.
- **Gapless playback** - preload and pre-buffer the **next track** so transitions are seamless.

**Streaming & buffering:**
- Adaptive bitrate by network (lower quality on cellular, higher on Wi-Fi; user-selectable).
- Buffer ahead a few seconds; start fast at modest quality.
- **Prefetch the next song** in a playlist based on the queue (predictive loading).

**Offline downloads (the key feature):**
- Download tracks (chosen quality) to **app-private storage**, encrypted; store metadata + download status in **Room**.
- **WorkManager** for download jobs (Wi-Fi/charging constraints, resume via `Range`, retry).
- **DRM/license** management with expiry (offline tracks need periodic online check-in).
- The player checks local-first: play the downloaded file if present, else stream.

**Data layer:**
- **Room** as source of truth for library, playlists, queue, download state → works offline.
- Sync playlists/library across devices (delta sync); reconcile "liked"/queue changes made offline.

**UX & system integration:**
- Lock-screen + notification controls, headset button handling, audio focus (pause on call/other audio), Bluetooth/Android Auto.
- Crossfade, queue management, resume where you left off (persist position).

**Other concerns:** **caching** recently played for instant replay, **battery** (efficient codec, screen-off playback), **analytics** (play/skip/completion), **scrobbling** offline events to sync later.

**Trade-offs to name:** prefetch/buffer (instant playback & gapless vs data/battery), download quality (size vs fidelity), cache size (instant replay vs storage), Wi-Fi-only downloads (cost vs availability).
