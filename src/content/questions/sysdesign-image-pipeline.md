---
question: "Design the image loading and caching pipeline for an image-heavy app."
topic: system-design
difficulty: senior
tags: ["system-design", "images", "caching", "performance"]
---

Images dominate memory and bandwidth in feed/gallery apps, so the pipeline is a frequent deep-dive. In practice you'd use **Coil** (Compose) or **Glide** - and explaining *what they do* is the answer.

**The pipeline stages:**
```
request → memory cache → disk cache → network → decode/downsample → display
```

**Caching (multi-level):**
- **Memory cache** - `LruCache` of decoded bitmaps keyed by URL+size. Instant re-display; bounded by a fraction of app memory.
- **Disk cache** - encoded bytes on disk (survives process death), LRU-evicted; OkHttp can also cache the HTTP response.
- **Check memory → disk → network** in order; only hit the network on a miss.

**Decoding & memory safety (critical):**
- **Downsample** to the **target view/composable size** - never decode a 4000×3000 image for a 100dp thumbnail (that's ~48MB). `inSampleSize`/Coil's size resolution.
- Choose **bitmap config** (`RGB_565` when alpha isn't needed halves memory; hardware bitmaps keep pixels off-heap).
- Decode **off the main thread** (coroutines) to avoid jank.
- **Bitmap pooling/reuse** (Glide) to cut GC churn.

**Scrolling performance (lists):**
- **Cancel** in-flight requests for items **recycled/scrolled off** - otherwise you waste bandwidth and may bind the wrong image.
- **Prefetch** a few items ahead based on scroll direction/velocity.
- Stable keys so the right image binds to the right item; placeholder + crossfade.

**Network/quality:**
- Request **server-resized variants** per density/size (don't download full-res for thumbnails).
- Use the **right format** (WebP/AVIF) and `Cache-Control`.
- Progressive/blur-up placeholders for perceived speed.

**Other:** respect **Data Saver** (lower quality on cellular), bound caches to storage, clear on logout if private.

**Trade-offs to name:** memory cache size (instant re-display vs OOM risk), prefetch distance (smoothness vs data/battery/memory), quality/resolution (sharpness vs bandwidth), downsampling (memory vs detail).
