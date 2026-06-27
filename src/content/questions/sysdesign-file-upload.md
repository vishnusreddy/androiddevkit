---
question: "Design a resumable file upload/download manager."
topic: system-design
difficulty: senior
tags: ["system-design", "upload", "workmanager", "networking"]
---

This tests **reliability under flaky networks**: large transfers, resume after interruption, progress, and background continuation.

**Requirements:** upload/download large files, survive app kill & network drops, **resume** (not restart), show progress, retry, respect Wi-Fi/metered preferences.

**Resumable transfers - the core:**
- **Chunked / multipart upload** - split the file into chunks (e.g. 5–10MB); upload sequentially or with bounded concurrency. Track which chunks succeeded.
- **Resumable protocol** - use the server's resumable upload API (e.g. **tus**, Google Resumable Uploads, or S3 multipart). The client asks "how much did you receive?" and continues from there with `Content-Range`.
- **Downloads** - use HTTP **`Range` requests** (`Range: bytes=1024-`) to resume from the last byte written to disk.
- Persist transfer **state** (file id, upload URL/session, bytes transferred, chunk status) in **Room** so it survives process death.

**Background execution & reliability:**
- **WorkManager** with constraints (`NetworkType.UNMETERED` for "Wi-Fi only", `requiresCharging`) - guaranteed, survives app death and reboot, retries with **exponential backoff**.
- A **foreground service** (or `setForeground` expedited work) for large active transfers so the OS doesn't kill them and the user sees progress.
- Queue + dedup; cap concurrency to avoid saturating the radio.

**Progress & UX:**
- Emit progress via WorkManager `setProgress` / a Flow → notification + in-app UI.
- **Optimistic UI** - show the item as "uploading"; mark complete/failed on result.
- Pause/resume/cancel controls; retry failed.

**Other concerns:**
- **Integrity** - checksum (MD5/SHA) per chunk and whole file to detect corruption.
- **Battery/data** - defer to Wi-Fi/charging when possible; respect Data Saver.
- **Failure handling** - distinguish transient (retry) vs permanent (auth, file gone) errors; expire stale sessions.
- **Security** - signed upload URLs, auth headers, HTTPS.

**Trade-offs to name:** chunk size (more chunks = more resumable granularity but more overhead), concurrency (speed vs radio/battery), Wi-Fi-only (reliability/cost vs immediacy), foreground service (survivability vs a persistent notification).
