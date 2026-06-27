---
question: "How do you handle large bitmaps without running out of memory?"
topic: android-fundamentals
difficulty: mid
tags: ["bitmap", "memory", "performance"]
---

Bitmaps are the #1 cause of `OutOfMemoryError` because they're huge in memory: a bitmap's RAM ≈ `width × height × bytesPerPixel`. A 4000×3000 photo at `ARGB_8888` (4 bytes/px) is **~48 MB** - regardless of the file's compressed size on disk.

**Techniques:**

**1. Downsample when decoding** - never decode full-res for a thumbnail. Use `inSampleSize` to load a scaled version:
```kotlin
val opts = BitmapFactory.Options().apply { inJustDecodeBounds = true }
BitmapFactory.decodeFile(path, opts)              // read dimensions only
opts.inSampleSize = calculateInSampleSize(opts, reqWidth, reqHeight)
opts.inJustDecodeBounds = false
val bitmap = BitmapFactory.decodeFile(path, opts) // decode scaled
```

**2. Pick the right config** - `RGB_565` (2 bytes/px) halves memory vs `ARGB_8888` when you don't need alpha; `HARDWARE` bitmaps keep pixels in GPU memory.

**3. Use an image library** - **Coil** (Compose-native) or Glide handle all of this: automatic downsampling to the target view/size, **memory + disk LRU caches**, bitmap **pooling/reuse**, request **cancellation** when a view is recycled, and lifecycle awareness. In practice you almost never hand-decode.
```kotlin
AsyncImage(model = url, contentDescription = null, modifier = Modifier.size(96.dp))
```

**4. Other practices:**
- Decode **off the main thread** (coroutines) to avoid jank/ANR.
- In lists, **cancel** loads for recycled items and size to the actual view dimensions.
- Bound caches; don't hold strong references to bitmaps you no longer show.
- For very large images, consider `BitmapRegionDecoder` (tiles) for pan/zoom.
