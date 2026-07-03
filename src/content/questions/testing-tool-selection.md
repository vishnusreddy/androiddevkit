---
question: "When should you use JUnit, Robolectric, Espresso, Compose tests, or UI Automator?"
topic: testing-quality
difficulty: junior
order: 30
starred: true
section: "Testing foundations"
tags: ["testing", "robolectric", "espresso", "ui-automator", "compose"]
---

Choose the smallest environment that can prove the behavior.

| Tool or environment | Best fit | What it does not prove |
|---|---|---|
| Local JUnit test | Pure Kotlin logic, reducers, ViewModels, use cases, mappers | Android framework and real-device behavior |
| Robolectric | Framework-dependent code that benefits from fast JVM execution | Every device, rendering, and platform integration detail |
| Compose UI test | Semantics, actions, state rendering, and Compose navigation flows | Visual pixel accuracy unless paired with screenshots |
| Espresso | View-based UI inside your app process | Interactions with other apps or system UI |
| UI Automator | Permissions, notifications, settings, app-to-app, and full device flows | Fast, isolated feedback |

This is not a ladder where every unit test must be repeated at every level. A
date formatter needs a local test. A Room query needs a database integration
test. A permission flow may require UI Automator because the permission dialog
belongs to the system.

A healthy suite uses fast tests for most behavioral combinations and a smaller
number of device tests for framework integration and critical journeys. If a
test requires a device only because the production class directly creates an
Android dependency, first ask whether the design can expose a smaller seam.
