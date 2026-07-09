---
question: "How does ART's garbage collector reclaim memory without freezing the UI, and how do you reduce GC pressure?"
topic: platform-internals
difficulty: senior
order: 50
section: "Memory and garbage collection"
tags: ["gc", "art", "memory", "performance"]
---

Garbage collection reclaims Java-heap objects that are no longer reachable. The
interview goal is to explain how ART does this with minimal UI impact and what you
can do to make it run less often.

**Reachability, not reference counting.** ART's collector starts from a set of
**GC roots** (thread stacks and local variables, static fields, and JNI global
references) and traces every object reachable from them. Anything not reached is
garbage and its memory is reclaimed. Because it traces reachability, plain
reference cycles are collected fine; the thing that actually leaks is an object
still reachable from a long-lived root, for example a static field or a running
callback holding an Activity.

**The modern collector is concurrent copying.** ART uses a **Concurrent Copying
(CC)** collector. Most of its work runs on a background thread while your app keeps
executing, using **read barriers** to stay correct while it moves objects. Moving
(compacting) live objects together reduces fragmentation and makes future
allocation cheap (close to a bump pointer). There are still short
**stop-the-world** pauses at the start and end, but they are brief compared with
Dalvik's older mark-and-sweep, which paused far more visibly.

**It is generational.** Since Android 10 (API 29) the CC collector is
generational: it collects the **young generation** (recently allocated, usually
short-lived objects) frequently and cheaply, and only occasionally does a full
heap collection. This matches how apps actually allocate, since most objects die
young.

**Why you still care, even though it is concurrent.** GC is cheaper than it was,
but it is not free. Frequent collections steal CPU and can still cause dropped
frames ("jank") when they coincide with rendering. The lever you control is
**allocation rate**: fewer allocations means fewer collections.

**Reducing GC pressure:**

- Do not allocate in hot paths: avoid creating objects inside `onDraw`, per-frame
  animation callbacks, or tight loops.
- Watch **autoboxing**. Using boxed `Integer` keys or a `HashMap<Integer, ...>` in
  a hot loop allocates; primitive-specialized structures such as `SparseArray` or
  `androidx.collection` avoid it.
- Reuse buffers and objects (object pools, `Bitmap` reuse, `StringBuilder`) instead
  of churning new ones.
- Be careful with short-lived lambdas and iterators in per-frame code.

The line that shows understanding: ART uses a mostly concurrent, generational
copying collector, so the fix for GC jank is almost never "tune the GC," it is
"allocate less on the paths that run every frame."
