---
question: "When would you choose Compose, Views, or a mixed UI?"
topic: jetpack-compose
difficulty: mid
order: 100
starred: false
section: "Mental model"
tags: ["compose", "views", "tradeoffs", "migration"]
---

For a new Android screen, Compose is usually the practical default. It gives the
team state-driven UI, Kotlin-only components, flexible layouts, previews, and a
strong modern ecosystem.

That does not make every rewrite sensible. Keep or embed Views when:

- a mature screen works well and has little reason to change
- a required SDK or specialist component only provides a View
- migration risk is larger than the product value
- the team needs to ship a focused change before it can invest in migration

Interop lets the decision happen one boundary at a time:

- Put Compose inside an existing hierarchy with `ComposeView`.
- Put a View inside Compose with `AndroidView` or `AndroidViewBinding`.
- In a Fragment, choose a composition disposal strategy that follows the
  Fragment view lifecycle.

The cost of a mixed screen is not just rendering. It includes two testing
models, focus and accessibility handoff, lifecycle ownership, nested scrolling,
theming, and debugging across the boundary. Keep the boundary deliberate and
small.

A senior answer should be based on constraints, not toolkit loyalty. Consider
the age of the code, team experience, SDK dependencies, performance evidence,
test coverage, and expected lifetime of the screen.

"Compose for new work, migrate existing UI when the value justifies it" is a
reasonable default. A big-bang rewrite is rarely the only option.
