---
question: "PSS, RSS, and USS: how do you actually measure how much memory your app is using?"
topic: platform-internals
difficulty: mid
order: 20
section: "Memory and garbage collection"
tags: ["memory", "pss", "profiling", "dumpsys"]
---

"How much memory does my app use" has no single answer, because a process shares
pages (framework code, fonts, native libraries) with every other app. The three
metrics you are expected to know separate shared from private memory.

- **RSS (Resident Set Size):** all physical RAM pages the process currently has
  mapped, **including shared pages counted in full**. RSS overcounts, because the
  same shared framework pages show up in the RSS of every app.
- **PSS (Proportional Set Size):** private pages **plus** each shared page divided
  by the number of processes sharing it. PSS is the fairest single number for one
  process, because shared cost is split proportionally. If you report one figure,
  report PSS.
- **USS (Unique Set Size):** only the **private** pages, the memory that would be
  freed if the process died right now. USS is the best measure of what your app
  alone is responsible for.

So for the same process, USS is smallest, PSS is in the middle, and RSS is largest.

**How to read them in practice:**

- `adb shell dumpsys meminfo <package>` gives a per-process breakdown: Java heap,
  native heap, code, stack, graphics, and the totals including PSS. This is the
  fastest way to see whether growth is on the Java heap, the native heap, or
  graphics.
- The **Android Studio Memory Profiler** shows the same categories live and lets
  you capture a heap dump to find what is retained.
- `Debug.getMemoryInfo()` and `ActivityManager.getProcessMemoryInfo()` expose PSS
  breakdowns programmatically if you want to log them.

**Why the distinction matters for debugging.** If total PSS climbs but the Java
heap is flat, your leak is native (bitmaps since Android 8, direct buffers, a
native library), and a Java heap dump will not show it. If the Java heap climbs,
capture a heap dump and look for objects retained by a long-lived root. Picking the
wrong tool for the wrong heap is the usual reason a "leak" stays unfound.

The summary: RSS overcounts shared memory, USS counts only private memory, and PSS
splits the difference, so PSS is the number to track over time and the category
breakdown from `dumpsys meminfo` tells you which heap to investigate.
