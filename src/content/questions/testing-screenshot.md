---
question: "When are screenshot or golden tests useful, and how do you keep them stable?"
topic: testing-quality
difficulty: mid
order: 100
starred: false
section: "Specialized quality tests"
tags: ["testing", "screenshots", "visual-regression", "compose"]
---

Screenshot tests render a component or screen and compare the pixels with an
approved baseline. They catch visual regressions that semantics assertions miss:
spacing, clipping, colors, typography, icon alignment, and unexpected wrapping.

They are most useful for a design system and a deliberate state matrix:

- Light and dark themes.
- Small and large font scales.
- Loading, empty, error, and populated states.
- Long text, right-to-left layout, and representative screen sizes.
- Components whose appearance is part of the public design contract.

Host-side tools can render quickly in CI, while device screenshots provide more
platform fidelity at greater cost. Whichever tool you choose, pin fonts, locale,
density, theme, animation state, clock, and random data. Compare only after the
UI is idle.

Do not record a baseline automatically after every failure. A human should
review the diff and decide whether it is an intentional design change. Store
baselines in version control or a reviewable artifact system, and make the CI
failure show expected, actual, and difference images.

Screenshot tests complement semantics tests. They can prove that a button looks
right, but not that it has an accessible role, can be clicked, or triggers the
correct behavior.
