---
question: "How does the View rendering pipeline work? (measure, layout, draw — and invalidate vs requestLayout)"
topic: android-fundamentals
difficulty: senior
tags: ["views", "rendering", "performance"]
---

A `View` is rendered in **three passes**, traversing the view tree top-down:

1. **Measure** (`onMeasure`) — each parent passes **`MeasureSpec`** (a mode + size: `EXACTLY`, `AT_MOST`, `UNSPECIFIED`) to children; each child reports its desired size via `setMeasuredDimension`. Determines **how big**.
2. **Layout** (`onLayout`) — parents position children by calling `child.layout(l, t, r, b)`. Determines **where**.
3. **Draw** (`onDraw`) — each view renders itself onto a `Canvas`, parents before children.

```
requestLayout → measure → layout → draw
invalidate    → draw only
```

**`invalidate()` vs `requestLayout()` — the key distinction:**
- **`invalidate()`** — "I need to **redraw**, but my size/position is unchanged." Schedules only the **draw** pass for that view. Use when only appearance changes (color, text content of same size).
- **`requestLayout()`** — "My **size or position** may have changed." Triggers a full **measure + layout (+ draw)** pass, walking **up** to the root and back down. More expensive.

Using the wrong one is a classic bug: change content that affects size but only call `invalidate()` → the view redraws but is clipped/wrong size because it wasn't re-measured.

**Performance points:**
- **Avoid deep view hierarchies** — each level adds measure/layout cost (mitigated with `ConstraintLayout` to flatten, `merge` tags, `ViewStub`).
- **Don't allocate in `onDraw`/`onMeasure`** — they run on every frame/pass; allocate paints/objects once.
- **Overdraw** — drawing the same pixel multiple times; minimize overlapping backgrounds (debug with "Show overdraw").
- A double measure pass (e.g. `RelativeLayout`, `weight` in `LinearLayout`) is costly in lists.

**Compose parallel:** Compose's phases are the same idea (composition → layout → drawing), but layout is **single-pass** by design.

**Soundbite:** "Views render via measure (how big, with MeasureSpec) → layout (where) → draw (how). `invalidate()` redraws only; `requestLayout()` re-measures and re-lays out up and down the tree — use the right one and keep hierarchies shallow."
