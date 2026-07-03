---
question: "How do you test Android accessibility instead of relying only on manual checks?"
topic: testing-quality
difficulty: mid
order: 110
starred: false
section: "Specialized quality tests"
tags: ["testing", "accessibility", "compose", "semantics"]
---

Accessibility needs automated checks, focused interaction tests, and manual
assistive-technology testing. No single layer catches everything.

**Automated checks:** enable Accessibility Test Framework checks in View-based
tests where appropriate, run Android lint, and inspect Compose semantics. Catch
missing labels, tiny touch targets, duplicate descriptions, low contrast, and
invalid traversal relationships early.

**UI behavior tests:** find controls by role, label, text, or content description
rather than visual coordinates. Assert important semantics such as selected,
disabled, heading, state description, and custom actions. Test large font scale,
right-to-left layout, keyboard or switch navigation, and dynamic announcements.

**Manual checks:** complete critical flows with TalkBack and keyboard or switch
access. Check focus order, whether focus is lost after navigation or updates,
whether errors are announced, and whether gestures have accessible alternatives.

Use `testTag` for test plumbing only when no user-facing semantic exists. A test
that can find a button only through a private tag may pass while a screen reader
cannot identify it.

Include accessibility in component APIs and design-system tests. It is much
cheaper to make one shared button correct than to repair the same issue across
every feature.
