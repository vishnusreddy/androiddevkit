---
question: "How does Binder let one process call another, and why is system_server on the other end of so many APIs?"
topic: platform-internals
difficulty: senior
order: 30
starred: true
section: "Binder and IPC"
tags: ["binder", "ipc", "aidl", "system-server"]
---

Binder is Android's inter-process communication mechanism. Almost every framework
call that touches something outside your process, getting a system service,
starting an Activity, showing a notification, is a Binder transaction under the
hood.

**The shape of a call.** Your app holds a proxy object that looks like a normal
interface. When you call a method on it:

1. The arguments are **marshaled** into a `Parcel` (a flat byte buffer).
2. The proxy hands that Parcel to the **Binder kernel driver** at `/dev/binder`.
3. The driver copies the data into the target process and wakes a thread in that
   process's **Binder thread pool**.
4. The target unpacks the Parcel, runs the real method, and marshals the result
   back the same way.

To your calling code it looks synchronous: the calling thread blocks until the
reply comes back, unless the interface is declared `oneway`, in which case the
call is fire-and-forget and returns immediately.

**AIDL generates the boilerplate.** When you define an interface in AIDL, the
build generates the proxy (`Stub.Proxy`) on the caller side and the stub (`Stub`)
on the implementer side, so you write an interface and the marshaling is handled
for you. This is exactly how bound services and the framework's own services are
wired.

**Why system_server keeps showing up.** The core system services, ActivityManager,
PackageManager, WindowManager, and dozens more, all live in a single privileged
process called `system_server`. Your app cannot touch the screen, the task stack,
or another app directly; it asks a system service to do it, and that service runs
in `system_server` with the permissions your app lacks. So a huge share of your
Binder traffic terminates there. This is also why a wedged `system_server` takes
the whole UI down with it.

**Two consequences interviewers probe:**

- **Threads.** Incoming Binder calls run on a pool thread, not your main thread,
  and the pool is bounded (16 threads by default). A slow Binder method can
  starve the pool, and a service callback you receive arrives on a Binder thread,
  so you must hop to the main thread before touching UI.
- **Size.** Every process has a limited Binder transaction buffer, which is why
  passing large payloads across Binder throws `TransactionTooLargeException`.

The one-liner to remember: Binder is a kernel-mediated, thread-pooled RPC, and
`system_server` is the privileged process on the far end of most system APIs.
