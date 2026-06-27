---
question: "Explain Activity launch modes and the related intent flags."
topic: android-fundamentals
difficulty: mid
tags: ["activity", "launch-modes", "tasks"]
---

Launch modes control how an Activity instance relates to the **task back stack**. Set them in the manifest (`android:launchMode`) or via intent flags.

- **`standard`** (default) - a **new instance** every time it's launched, even if one already exists. Can have multiple copies in the stack.
- **`singleTop`** - if an instance is already at the **top** of the stack, reuse it and deliver the intent to **`onNewIntent()`** instead of creating a new one. If it's not on top, a new instance is created.
- **`singleTask`** - at most **one instance** in the task. If it exists, it's brought to the front and everything above it is cleared (`onNewIntent` is called). Common for an app's entry/root activity.
- **`singleInstance`** - like `singleTask`, but the activity is the **only** one in its task - nothing else can be added to that task. Rare (e.g. a launcher or a separate-window screen).

**Equivalent intent flags** (set at launch time, no manifest change):
- `FLAG_ACTIVITY_NEW_TASK` - start in a new/ existing task.
- `FLAG_ACTIVITY_SINGLE_TOP` - like `singleTop` for this launch.
- `FLAG_ACTIVITY_CLEAR_TOP` - if the activity exists in the stack, clear everything above it.
- `FLAG_ACTIVITY_CLEAR_TASK` (with `NEW_TASK`) - wipe the task and start fresh (e.g. after logout).

**`onNewIntent()`** is the callback you must handle when an existing instance is reused - the new `Intent` arrives there, not in `onCreate`. Forgetting it means you process the *old* intent's data.

**Practical uses:** `singleTask`/`CLEAR_TOP` for "go home" buttons and notification taps that shouldn't stack duplicates; `singleTop` for a search activity re-launched with a new query; `CLEAR_TASK + NEW_TASK` to reset the stack on logout.
