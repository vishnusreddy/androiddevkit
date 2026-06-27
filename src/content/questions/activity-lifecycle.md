---
question: "Walk through the Activity lifecycle and what happens on rotation."
topic: android-fundamentals
difficulty: junior
tags: ["lifecycle", "activity"]
---

Think of the Activity lifecycle as three questions: **Does the Activity exist? Is
it visible? Can the user interact with it?** The main callbacks are:

- **`onCreate`** - create this Activity instance and set up its UI.
- **`onStart`** - activity becomes visible.
- **`onResume`** - activity is in the foreground and interactive.
- **`onPause`** - losing focus (a dialog, another activity in front). Keep this fast.
- **`onStop`** - no longer visible.
- **`onDestroy`** - being torn down (finished or recreated).

**On rotation**, Android normally destroys the current Activity instance and
creates a new one. You will usually see a sequence like this:

```
onPause → onStop → onDestroy
→ onCreate → onStart → onResume
```

The exact timing of state-saving callbacks can vary, so do not write logic that
depends on one precise callback order. The important point is that Activity
fields belong to the old instance and are lost.

- **`ViewModel`** keeps screen data across configuration changes.
- **`onSaveInstanceState`, `SavedStateHandle`, or `rememberSaveable`** keep small
  pieces of restorable UI state, such as a selected tab or search query.

**Common follow-up:** Process death also removes the ViewModel because the whole
app process is gone. Restore the minimum state needed to rebuild the screen and
load durable data again from a database or network source.
