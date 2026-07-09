---
question: "How does an Android app process actually start, and what is the zygote?"
topic: platform-internals
difficulty: senior
order: 20
section: "Kernel and processes"
tags: ["zygote", "process", "startup", "fork"]
---

When the user taps your icon, no new copy of the framework is loaded from scratch.
Android uses a warm-fork model built around a process called the **zygote**.

**The zygote is a template process.** At boot, `init` starts the zygote through
`app_process`. The zygote loads and initializes the common expensive things every
app needs: the core framework classes, shared resources, and the ART runtime. It
then sits and waits, listening on a socket.

**New app processes are forked, not created fresh.** When ActivityManager (inside
`system_server`, which is itself forked from the zygote at boot) needs to launch
your app, it asks the zygote to `fork()`. The child inherits everything the zygote
preloaded through **copy-on-write** memory: pages are shared until one side writes
to them, so most of the framework stays shared across every app and costs almost
nothing per process. The forked child then loads your APK's classes and calls into
`ActivityThread.main()`, which sets up the main looper and drives your components.

**Why this design matters:**

- **Fast starts.** Preloading in the zygote means your process begins with the
  runtime and framework already warm, so cold start is much cheaper than a full
  load would be.
- **Memory sharing.** Copy-on-write keeps shared framework pages from being
  duplicated per app, which is a big deal on low-RAM devices.
- **A consistent baseline.** Every app inherits the same initialized state.

**Related pieces worth naming:**

- There are usually separate 64-bit and 32-bit zygotes so apps of either ABI can
  be forked.
- An **app zygote** (a per-app child template) supports isolated processes, useful
  for hardened components that should run with fewer privileges.
- Because your process is forked and later loaded with your code, anything the
  framework did before your `Application.onCreate` (content providers initializing,
  for example) runs during that startup window and counts against your cold start.

In an interview, the phrase that lands is "processes are forked from a preloaded
zygote using copy-on-write." It shows you know why launching an app is fast and
why the framework is not reloaded every time.
