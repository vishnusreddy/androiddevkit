---
question: "What does Android's Linux kernel give each app, and what does it really mean when the system kills your process?"
topic: platform-internals
difficulty: senior
order: 10
starred: true
section: "Kernel and processes"
tags: ["kernel", "process", "sandbox", "lmkd"]
---

Android is a Linux system with a managed runtime and a large framework on top.
The kernel is what makes the sandbox real, and understanding it explains a lot of
behavior that otherwise looks arbitrary.

**Every app is a Linux user.** At install time each app is assigned a unique
Linux UID. Its process runs under that UID, and normal Linux file permissions
plus SELinux policy stop it from reading another app's private data or the
system's. This is the app sandbox: it is enforced by the kernel, not by the
runtime, so native code and JNI cannot escape it either. Two apps signed with the
same key can opt into a shared UID (now deprecated), which is the exception that
proves the rule.

**Each app usually gets its own process and its own virtual machine instance.**
The process is created by forking the zygote, so the app starts with the
framework already loaded. Isolation between apps is therefore process isolation
backed by separate UIDs.

**The kernel also manages memory pressure.** Android does not swap to disk the
way a desktop does. When RAM runs low, a userspace daemon called `lmkd` (the low
memory killer daemon) reads kernel pressure signals and kills whole processes to
free memory. It chooses victims by an `oom_adj` score that tracks how important
each process is right now:

- A **foreground** app the user is looking at is almost never killed.
- A **cached** process (your app in the background with nothing running) is first
  in line to die.
- A **foreground service** sits in between and buys you time, not immunity.

**What "the system killed my process" means.** Your process was terminated by the
kernel, immediately, to reclaim memory. There is no graceful shutdown: `onDestroy`
is not guaranteed to run, and any in-memory state is gone. You may have received
`onTrimMemory` earlier as a warning, but the kill itself has no callback. This is
why durable state belongs in `SavedStateHandle`, a database, or `DataStore`, and
why work that must finish belongs in `WorkManager` rather than a background thread
you assume will keep running.

The practical takeaway for interviews: background survival is a privilege the
system grants based on your current importance, and it can be revoked without
warning. Design for the process disappearing, because on a low-memory device it
will.
