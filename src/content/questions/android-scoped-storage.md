---
question: "What is scoped storage, and how do you access files and media on modern Android?"
topic: android-fundamentals
difficulty: mid
tags: ["storage", "scoped-storage", "permissions"]
---

**Scoped storage** (enforced from Android 10/11) restricts an app's broad access to shared external storage. An app can freely access **its own** directories but needs specific mechanisms (and often user consent) for **shared** files — improving privacy and removing the need for the broad `READ/WRITE_EXTERNAL_STORAGE` permission in most cases.

**Where data goes:**
- **App-specific internal storage** (`filesDir`, `cacheDir`) — private, no permission, wiped on uninstall.
- **App-specific external storage** (`getExternalFilesDir`) — private to your app, no permission needed.
- **Shared collections** (Photos, Videos, Audio, Downloads) — accessed via **`MediaStore`**.

**How to access shared media/files:**
- **`MediaStore`** — query/insert into the media collections. Your **own** media needs no permission; reading **others'** media needs the granular permissions (`READ_MEDIA_IMAGES`/`VIDEO`/`AUDIO` on Android 13+).
- **Photo Picker** (`ACTION_PICK_IMAGES` / `PickVisualMedia`) — system UI to pick images/videos with **no permission at all**. The recommended way to let users choose photos.
- **Storage Access Framework (SAF)** — `ACTION_OPEN_DOCUMENT` / `ACTION_CREATE_DOCUMENT` for user-chosen documents in any provider (Drive, local). Returns a `content://` URI you have grant to.
- **`FileProvider`** — share *your* files with other apps via temporary URI permissions instead of file paths.

**Points interviewers want:**
- Raw **file paths** to shared storage no longer work generally — use **URIs** (`MediaStore`/SAF).
- Prefer **Photo Picker** over requesting media permissions — zero permission, better UX, Play-friendly.
- `MANAGE_EXTERNAL_STORAGE` ("All files access") is **heavily restricted** by Play — only for genuine file-manager apps.
- App-specific dirs need **no** permission and are the default for app data/caches.

**Soundbite:** "Scoped storage limits broad external access: use app-specific dirs (no permission), `MediaStore`/granular media permissions for shared media, the **Photo Picker** (no permission) for picking images, and SAF/`FileProvider` for documents and sharing — file paths give way to content URIs."
