---
question: "What is JNI, and what are the main ways native code goes wrong when you call into it?"
topic: platform-internals
difficulty: senior
order: 70
section: "Native code and JNI"
tags: ["jni", "ndk", "native", "references"]
---

**JNI (Java Native Interface)** is the bridge that lets Kotlin/Java code call C/C++
and the reverse. You declare an `external` function, load the library with
`System.loadLibrary`, and the runtime binds your call to a native function that
receives a `JNIEnv*` pointer, which is the handle for talking back into the
runtime. The NDK is how you build the native side. People reach for it for CPU-heavy
work (media, crypto, ML), to reuse an existing C/C++ library, or for tight
performance-sensitive loops.

The value of this question is the failure modes, because JNI bugs are native
crashes with no Java stack trace, so they are painful to debug.

**Reference management is the big one.** Objects handed across the boundary are
accessed through references, and there are three kinds:

- **Local references** are the default. They are valid only until the native method
  returns and are freed automatically then. The catch: the local reference table
  is bounded (a few hundred slots are guaranteed). Create many local refs in a
  loop without calling `DeleteLocalRef`, and you overflow the table and crash.
- **Global references** (`NewGlobalRef`) survive across calls, but you **must**
  `DeleteGlobalRef` them yourself. Forgetting is a straightforward leak that also
  pins the referenced object so GC can never collect it.
- **Weak global references** let you hold something without preventing its
  collection, so you must check whether it is still alive before use.

**Threading is the second trap.** A `JNIEnv*` is **per-thread and not shareable**.
If native code creates its own thread, it must call `AttachCurrentThread` to get a
valid `JNIEnv` for that thread before touching the runtime, and `DetachCurrentThread`
before the thread exits. Caching a `JNIEnv` from one thread and using it on another
is undefined behavior.

**Other common mistakes:**

- **Not checking for pending exceptions.** After a JNI call that can throw, you must
  check and clear the exception, or later JNI calls behave unpredictably.
- **Signature and ABI errors.** A wrong method signature fails at bind time, and
  shipping the wrong ABI means the library will not load on that device.
- **Crossing the boundary too often.** Each JNI transition has overhead, so chatty
  designs that call back and forth per element are slow. Batch the work on one side.

The summary: JNI connects managed and native code through a per-thread `JNIEnv`, and
the bugs that bite are reference-table overflow, leaked global references, using a
`JNIEnv` on the wrong thread, and ignoring pending exceptions, all of which surface
as native crashes rather than clean Java errors.
