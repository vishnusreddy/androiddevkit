---
question: "Walk through the Fragment lifecycle. Why is the View lifecycle separate?"
topic: android-fundamentals
difficulty: mid
tags: ["fragments", "lifecycle"]
---

A Fragment has **two** lifecycles - the fragment instance and its **view** - and the gap between them is the source of most fragment bugs.

**Fragment callbacks:**
`onAttach` → `onCreate` → `onCreateView` → `onViewCreated` → `onStart` → `onResume` → … → `onPause` → `onStop` → `onDestroyView` → `onDestroy` → `onDetach`.

**The key insight:** `onCreateView`/`onDestroyView` can run **multiple times** while the fragment instance stays alive. When a fragment goes on the back stack, its **view is destroyed** (`onDestroyView`) but the **fragment object survives**. Coming back, `onCreateView` runs again - a *new* view.

**Consequences interviewers probe:**
- Use **`viewLifecycleOwner`**, not `this` (the fragment), when observing LiveData/flows in a fragment. Observing with the fragment lifecycle in `onCreateView` leaks: after `onDestroyView` the old view is gone but the observer (tied to the longer-lived fragment) keeps firing and may touch a dead view, or you get **duplicate observers** when the view is recreated.
  ```kotlin
  viewModel.data.observe(viewLifecycleOwner) { render(it) }
  ```
- **Null out ViewBinding** in `onDestroyView` (`_binding = null`) - the binding references the destroyed view and leaks it otherwise.
- Collect flows in `onViewCreated` with `viewLifecycleOwner.lifecycleScope` + `repeatOnLifecycle`.

**Why fragments at all:** reusable UI chunks with their own lifecycle, used by Navigation, ViewPager, and multi-pane (tablet) layouts. Modern apps often use a **single-Activity** architecture with fragment (or Compose) destinations.
