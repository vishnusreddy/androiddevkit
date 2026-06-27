---
question: "Design a photo gallery app (like Google Photos) with backup."
topic: system-design
difficulty: senior
tags: ["system-design", "media", "upload", "performance"]
---

**Requirements:** browse thousands of local + cloud photos in a fast grid, view full-res, **auto-backup** to cloud, work offline.

**Browsing performance (huge lists):**
- **Grid of thumbnails** via `LazyVerticalGrid` with **stable keys** and `contentType`.
- Load photos from **`MediaStore`** (local) + a Room cache of cloud photo metadata; merge and sort by date.
- **Thumbnails, not full-res** - request/generate small thumbnails sized to the grid cell (Coil downsampling). A 12MP photo as a 100dp thumb must not decode at full size (OOM).
- **Prefetch** rows ahead of scroll; **cancel** off-screen loads; bound the memory cache.
- For full-res view: load progressively (thumb → full), support pinch-zoom with `BitmapRegionDecoder` for very large images.

**Auto-backup (the reliability piece):**
- A **WorkManager** periodic/expedited job scans `MediaStore` for new photos and uploads them - constraints: **Wi-Fi/unmetered + charging** by default (user-configurable).
- **Resumable chunked upload** so large videos survive interruptions; track per-file upload state in Room.
- **Foreground service** for large active backups so the OS doesn't kill them; show progress.
- **Idempotency** - content hash to skip already-uploaded files and dedupe.

**Data model:**
- **Room** caches photo metadata (id, localUri, remoteUrl, takenAt, backupStatus, hash) → instant grid offline.
- Sync cloud library via delta (new/deleted since last sync token).

**Other concerns:** **permissions** - Android 13+ granular media permissions or the **Photo Picker** (no permission) if you only need user-selected photos; **scoped storage** (content URIs, not file paths); **EXIF**/orientation handling; cache eviction to bound storage; battery/data awareness.

**Trade-offs to name:** thumbnail cache size (scroll smoothness vs memory/OOM), prefetch depth (smoothness vs memory/battery), backup constraints (timeliness vs data/battery - Wi-Fi-only delays backup but saves the user's plan), local thumbnail generation vs server-side variants.
