---
title: Platform Internals
description: What sits under the SDK - the Linux kernel, Binder IPC, the ART runtime and its compiler, the memory model and GC, JNI, and how apps are hardened with obfuscation and encryption.
category: Android
order: 18
icon: "⌘"
---

Most Android questions stop at the SDK surface. Senior and staff interviews go a
layer down and ask what the framework is actually sitting on: the kernel, the
runtime, the way memory is laid out, how one process talks to another, and how a
shipped APK is protected. You rarely write this code, but you are expected to
reason about it when an app is slow to start, leaking memory, crashing only in
release, or handling something sensitive.

### A simple study path

Start with the process model and Binder, because almost every framework call you
make is a Binder transaction into `system_server`. Then learn the memory model:
Java heap, native heap, and how the garbage collector reclaims one of them. After
that, the compilation pipeline (DEX, `dex2oat`, JIT and AOT, Baseline Profiles),
JNI, and finally app hardening with R8 and the Keystore.

### What gets tested

- **Kernel and processes** - each app as a Linux user with its own UID, the zygote fork model, the low memory killer, and what "the system killed my process" really means.
- **Binder and IPC** - how a method call crosses a process boundary, the per-process transaction buffer and `TransactionTooLargeException`, and why `system_server` is on the other end of so many APIs.
- **Memory and garbage collection** - the managed Java heap versus the native heap, where `Bitmap` pixels live, what triggers `OutOfMemoryError`, and how ART's concurrent collector reclaims memory without freezing the UI.
- **Compilation and startup** - the `.dex` to `.oat` journey through `dex2oat`, the interpreter/JIT/AOT mix, and how Baseline Profiles pre-compile the paths that matter for a fast cold start.
- **Native code and JNI** - crossing into C/C++, the local/global/weak-global reference tables, attaching native threads, and the failure modes that only show up under load.
- **Security and hardening** - what R8 obfuscation does and does not protect, file-based encryption, the Android Keystore and hardware-backed keys, and why a secret shipped in the APK is never really secret.

### How interviewers ask

Expect "where does this memory live and who frees it?", "what happens between
tapping the icon and your first frame?", and "how would you store this token so a
rooted device cannot read it?". Strong answers name the exact mechanism (the
Binder driver, `dex2oat`, a concurrent copying collector, a hardware-backed
Keystore key) and, just as importantly, name the limit of that mechanism.

> **Prep tip:** for every internal you learn, be ready to say what it protects
> against and what it does not. Obfuscation slows a human reader but does not
> encrypt anything; the Keystore hides key material but cannot stop a determined
> attacker on a rooted device from using the key while your app is running.
