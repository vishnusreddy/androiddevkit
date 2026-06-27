---
question: "How does touch event dispatch work in the View system? (dispatchTouchEvent, onInterceptTouchEvent, onTouchEvent)"
topic: android-fundamentals
difficulty: senior
tags: ["views", "touch", "events"]
---

A touch event (`MotionEvent`) travels **down** the view tree from the root and can be **consumed** or **passed back up**. Three methods govern it:

- **`dispatchTouchEvent`** — every `View`/`ViewGroup` has it; it **routes** the event. The tree traversal starts here.
- **`onInterceptTouchEvent`** (ViewGroup only) — a parent can **intercept** an event before it reaches a child. Return `true` to steal it (e.g. a scroll container deciding a drag is a scroll, not a child tap).
- **`onTouchEvent`** — where a view actually **handles** the event. Return `true` to **consume** it (and receive subsequent events in the gesture).

**The flow for a gesture (starting with `ACTION_DOWN`):**
1. Root `dispatchTouchEvent` → ViewGroup `onInterceptTouchEvent`.
2. If the parent **doesn't** intercept, it dispatches to the child under the finger; this recurses down.
3. The deepest view's `onTouchEvent` runs first. If it returns **`true`** (consumes), it becomes the target for the rest of the gesture (`MOVE`/`UP`).
4. If a view returns **`false`**, the event **bubbles up** to its parent's `onTouchEvent`.
5. **Crucial rule:** if no view consumes the **`ACTION_DOWN`**, that view (and its descendants) won't receive the rest of the gesture.

**Key mechanisms interviewers probe:**
- **`requestDisallowInterceptTouchEvent(true)`** — a child tells parents **not** to intercept (e.g. a `ViewPager` inside a scroll view, so swipes go to the pager).
- **Once a parent intercepts**, the child gets `ACTION_CANCEL` and stops receiving the gesture.
- This is exactly the kind of logic behind **nested scrolling conflicts** ("the inner RecyclerView won't scroll inside a ScrollView") — solved via `NestedScrollingChild`/interception rules.

**Soundbite:** "Touch dispatches down via `dispatchTouchEvent`; a ViewGroup can steal it with `onInterceptTouchEvent`; `onTouchEvent` consumes (return true) or passes it up. Whoever consumes `ACTION_DOWN` owns the gesture — and `requestDisallowInterceptTouchEvent` resolves parent/child conflicts."
