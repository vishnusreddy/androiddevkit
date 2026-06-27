---
question: "When would you choose Compose or the View system?"
topic: jetpack-compose
difficulty: mid
tags: ["compose", "views", "tradeoffs"]
---

**Compose advantages:**
- **Less code, one language** - UI in Kotlin, no XML, no `findViewById`/ViewBinding boilerplate.
- **State-driven** - `UI = f(state)` eliminates manual view-syncing bugs and inconsistent UI.
- **Powerful, simpler customization** - custom layouts, animations, and theming are far easier than custom Views/`onDraw`.
- **Reusable** via slot APIs; great tooling (Previews, live edit).

**Compose costs / caveats:**
- **Maturity gaps** - some specialized widgets and third-party SDKs still ship Views (maps, ads, some media) - handled via `AndroidView` interop.
- **Performance footguns** - easy to cause excessive recomposition if you don't understand stability/phases; needs Baseline Profiles to match View startup.
- **Learning curve** - recomposition, state, and effects are a different mental model.
- **Min SDK / size** - adds runtime; fine for most apps but a consideration for tiny ones.

**When you might stick with Views:**
- A large existing **View codebase** - migrate incrementally (Compose in a `ComposeView`) rather than rewrite.
- Heavy reliance on a **View-only SDK** with no Compose equivalent.
- Team without Compose experience on a tight timeline.

**The honest interview answer:** Compose is Google's recommended default for new UI in 2024+, and most shops are adopting it. But it's not all-or-nothing - interop lets Compose and Views coexist, so the real-world answer is usually "Compose for new screens, interop for the rest," not a big-bang rewrite.
