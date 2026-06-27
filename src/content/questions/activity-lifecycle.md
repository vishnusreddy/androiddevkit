---
question: "Walk through the Activity lifecycle and what happens on rotation."
topic: android-fundamentals
difficulty: junior
tags: ["lifecycle", "activity"]
---

The core callbacks, in order:

- **`onCreate`** — one-time setup: inflate UI, bind the ViewModel.
- **`onStart`** — activity becomes visible.
- **`onResume`** — activity is in the foreground and interactive.
- **`onPause`** — losing focus (a dialog, another activity in front). Keep this fast.
- **`onStop`** — no longer visible.
- **`onDestroy`** — being torn down (finished or recreated).

**On rotation**, the activity is destroyed and recreated:

```
onPause → onStop → onSaveInstanceState → onDestroy
→ onCreate → onStart → onRestoreInstanceState → onResume
```

Because the instance is thrown away, anything held in fields is lost. That's the whole reason for:

- **`ViewModel`** — survives configuration changes, so your data and in-flight coroutines don't restart.
- **`onSaveInstanceState` / `rememberSaveable`** — for small UI state that must survive *process death* too (the ViewModel doesn't survive that).

**Common follow-up:** "How is process death different from rotation?" Process death wipes everything including the ViewModel, so you restore from `SavedStateHandle`/`onRestoreInstanceState`. Test it with the "Don't keep activities" developer option.
