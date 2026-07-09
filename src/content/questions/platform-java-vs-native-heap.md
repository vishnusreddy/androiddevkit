---
question: "What is the difference between the Java heap and the native heap, and where do Bitmap pixels actually live?"
topic: platform-internals
difficulty: senior
order: 40
starred: true
section: "Memory and garbage collection"
tags: ["memory", "heap", "native", "bitmap", "oom"]
---

Your app's memory is not one pool. The two that matter most in interviews are the
**Java (managed) heap** and the **native heap**, and they behave differently.

**The Java heap** holds your Kotlin and Java objects. It is managed by ART and
reclaimed by the garbage collector. Crucially, it is **capped per app**: the
device sets a limit (you can read it with `ActivityManager.getMemoryClass()`,
often something like 128 to 512 MB depending on the device, larger with
`android:largeHeap`). When you allocate more Java objects than that cap allows and
GC cannot free enough, you get an **`OutOfMemoryError`**. So an `OutOfMemoryError`
is specifically a Java-heap failure.

**The native heap** holds memory allocated by C/C++ through `malloc`/`new`: this
includes native libraries, direct `ByteBuffer`s, and allocations made through JNI.
It is bounded by the device's real RAM and address space, not by the per-app Java
heap cap, and the garbage collector does not manage it. A native allocation
failure usually shows up as a native abort or a crash, not an `OutOfMemoryError`.

**Where Bitmap pixels live is the classic question.** This changed:

- **Before Android 8.0 (API 26):** bitmap pixel data was on the **Java heap**, so
  large images ate directly into that small, capped budget and were a leading
  cause of `OutOfMemoryError`.
- **Android 8.0 and later:** pixel data moved to the **native heap**. The small
  `Bitmap` object stays on the Java heap, but the pixels (the bulk of the memory)
  are native. This eased OOM crashes, but the memory is still very real; it just
  fails and is measured differently.

**Why this matters in practice:**

- If you only watch the Java heap in a profiler, a bitmap-heavy app on modern
  Android can look fine while native memory balloons. Look at native allocations
  and total PSS, not just the Java heap.
- Bitmaps are still the biggest single consumer for most apps. Downsample with
  `inSampleSize`, request the right target size, and let a library like Coil or
  Glide handle pooling and reuse rather than decoding full-resolution images.
- Direct `ByteBuffer`s and memory-mapped files are native too, which is why they
  can back large buffers without pressuring the Java heap.

The crisp summary: Java heap holds managed objects, is GC'd and per-app capped, and
overflowing it throws `OutOfMemoryError`; the native heap holds `malloc` memory and,
since Android 8, `Bitmap` pixels, and is bounded by device RAM.
