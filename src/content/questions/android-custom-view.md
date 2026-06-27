---
question: "How do you build a custom View, and what do you need to handle?"
topic: android-fundamentals
difficulty: senior
tags: ["views", "custom-view"]
---

Extend `View` (fully custom drawing) or an existing widget/`ViewGroup` (compose existing ones). A typical fully-custom view overrides three things plus constructors.

```kotlin
class RatingView @JvmOverloads constructor(
    context: Context, attrs: AttributeSet? = null, defStyle: Int = 0,
) : View(context, attrs, defStyle) {

    private val paint = Paint(Paint.ANTI_ALIAS_FLAG)   // allocate ONCE, not in onDraw

    init {
        // Read custom XML attributes
        context.obtainStyledAttributes(attrs, R.styleable.RatingView).use { a ->
            paint.color = a.getColor(R.styleable.RatingView_starColor, Color.YELLOW)
        }
    }

    override fun onMeasure(wSpec: Int, hSpec: Int) {
        // Resolve desired size honoring the MeasureSpec
        val size = resolveSize(desiredSize, wSpec)
        setMeasuredDimension(size, size)
    }

    override fun onDraw(canvas: Canvas) {
        canvas.drawCircle(width / 2f, height / 2f, radius, paint)
    }
}
```

**What you must handle:**
- **Constructors / `@JvmOverloads`** — XML inflation calls the `(Context, AttributeSet)` constructor; missing it crashes on inflate.
- **Custom attributes** — declare `<declare-styleable>` in `attrs.xml`, read via `obtainStyledAttributes` (and **recycle** it).
- **`onMeasure`** — respect the parent's `MeasureSpec` (`EXACTLY`/`AT_MOST`/`UNSPECIFIED`); use `resolveSize`. A `ViewGroup` also needs **`onLayout`** to place children.
- **`onDraw`** — render with `Canvas`; **never allocate** (Paint/Path/objects) here — it runs every frame.
- **State saving** — override `onSaveInstanceState`/`onRestoreInstanceState` for view state that should survive recreation.
- **Touch** — `onTouchEvent` / gesture detectors; call `invalidate()` to redraw, `requestLayout()` if size changed.
- **Accessibility** — set content descriptions / `AccessibilityNodeInfo` for custom controls.

**Points interviewers want:**
- Allocate paints/objects **once**; allocating in `onDraw`/`onMeasure` causes jank and GC churn.
- `invalidate()` for redraw vs `requestLayout()` for size changes.
- Prefer **composing existing views** or **Compose** over a fully custom `onDraw` unless you genuinely need custom rendering.

**Soundbite:** "Custom View = constructors for inflation, custom attrs via `obtainStyledAttributes`, `onMeasure` honoring MeasureSpec, allocation-free `onDraw`, plus state saving, touch, and accessibility — and never allocate in the draw/measure path."
