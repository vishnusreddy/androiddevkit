---
title: Android Fundamentals
description: Lifecycles, the four components, processes & memory, background execution, the build system, storage, and how the framework actually works.
category: Android
order: 15
icon: "▤"
---

The framework basics never go away — and senior interviews probe them *deeper*,
not less. These questions test whether you understand the platform you build on,
not just the libraries on top of it.

### What gets tested

- **Lifecycles** — Activity & Fragment lifecycles, the fragment view-lifecycle gap, configuration changes vs **process death**, `ViewModel` and `SavedStateHandle`.
- **The four components** — Activities (launch modes, tasks), Services (started/bound/foreground), BroadcastReceivers, ContentProviders, and the Intents that connect them.
- **Threading & the main thread** — Handler/Looper/MessageQueue, ANRs, why work must leave the main thread.
- **Memory** — leaks and how to find them (LeakCanary), Context types, bitmap/OOM handling, GC.
- **Background execution** — WorkManager vs services vs coroutines vs AlarmManager, Doze, and background limits.
- **Storage & data** — scoped storage, `MediaStore`/Photo Picker, DataStore vs SharedPreferences, Room.
- **Build & runtime** — APK vs AAB, R8/ProGuard, build variants & flavors, Dalvik vs ART (AOT/JIT), Baseline Profiles, app startup.
- **UI internals** — the View render pipeline (measure/layout/draw), touch dispatch, custom views, RecyclerView/DiffUtil, View Binding.
- **Platform** — permissions, notifications, deep links/App Links, resource qualifiers, lifecycle-aware components, single-Activity architecture.

### How interviewers ask

A lot of **"what happens when…?"** (rotation, process death, a background service after Oreo) and **"how would you debug/optimize…?"** (ANR, leak, slow cold start). They reward answers that connect the *why* — e.g. why `viewLifecycleOwner` exists, why `ViewModel` survives rotation but not process death, why services don't run freely in the background anymore.

> **Prep tip:** be able to trace what the **system** does — when it creates/destroys
> your process, components, and views — for any scenario. Most fundamentals
> questions are really "do you understand the OS's role here?"
