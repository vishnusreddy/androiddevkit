---
question: "View Binding vs Data Binding vs findViewById — what's the difference?"
topic: android-fundamentals
difficulty: junior
tags: ["viewbinding", "databinding", "views"]
---

Three ways to reference views in the View system, increasingly capable:

**`findViewById`** — the original: look up a view by id at runtime.
- **Problems:** not null-safe (returns a view that might be wrong/absent → crash), not type-safe (casts), and verbose.

**View Binding** — generates a **binding class per layout** with typed, non-null references to all id'd views.
```kotlin
val binding = ActivityMainBinding.inflate(layoutInflater)
setContentView(binding.root)
binding.titleText.text = "Hi"     // typed, non-null, no findViewById
```
- **Benefits:** **null-safe** and **type-safe**, near-zero overhead, minimal setup. The recommended replacement for `findViewById`.

**Data Binding** — a superset that also supports **binding expressions in XML**, linking layouts directly to data/observables.
```xml
<TextView android:text="@{viewModel.title}" />
<Button android:onClick="@{() -> viewModel.submit()}" />
```
- **Benefits:** two-way binding, observable data in layouts, binding adapters.
- **Costs:** **slower builds** (annotation processing), logic-in-XML can be hard to debug, and steeper complexity. Largely **superseded by Compose** for new code; many teams prefer View Binding + observing state in code over Data Binding.

**How to choose:**
- New View-based code → **View Binding** (simple, safe, fast).
- Legacy projects already using **Data Binding** → keep it, but it's not recommended for new adoption.
- New UI → **Compose** sidesteps all three.

**Note:** View Binding ≠ Data Binding — View Binding **only** generates references (no XML expressions), which is exactly why it's faster and simpler.

**Soundbite:** "`findViewById` is unsafe and verbose; View Binding generates typed, null-safe view references with near-zero cost; Data Binding adds XML expressions/two-way binding but slower builds — prefer View Binding for Views, Compose for new UI."
