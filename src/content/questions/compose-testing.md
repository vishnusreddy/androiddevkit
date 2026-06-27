---
question: "How do you test Compose UI?"
topic: jetpack-compose
difficulty: mid
tags: ["compose", "testing"]
---

Compose tests use a **semantics tree** (the same accessibility tree screen readers use), not view IDs. You find nodes, assert on them, and perform actions through a `ComposeTestRule`.

```kotlin
class CounterTest {
    @get:Rule val rule = createComposeRule()

    @Test fun increments() {
        rule.setContent { Counter() }

        rule.onNodeWithText("Count: 0").assertIsDisplayed()
        rule.onNodeWithContentDescription("Increment").performClick()
        rule.onNodeWithText("Count: 1").assertExists()
    }
}
```

The pieces:
- **Finders** — `onNodeWithText`, `onNodeWithTag` (`Modifier.testTag("...")`), `onNodeWithContentDescription`, `onAllNodes`.
- **Assertions** — `assertIsDisplayed`, `assertExists`, `assertIsEnabled`, `assertTextEquals`.
- **Actions** — `performClick`, `performTextInput`, `performScrollTo`, `performTouchInput`.
- **`createComposeRule`** for pure Compose; **`createAndroidComposeRule<Activity>()`** when you need a real Activity/host.

**Synchronization:** the test framework **auto-syncs** with recomposition and Compose-driven animations/coroutines — `waitForIdle()` happens implicitly between actions, so you rarely sleep. For non-Compose async, use `waitUntil { }`. You can disable auto-advance and control the clock with `mainClock` for animation tests.

**Good practices:**
- Add **`testTag`** for elements without stable text.
- Test **stateless composables** by passing state directly — easy because they're pure functions of inputs.
- **`@Preview`** + screenshot testing (Paparazzi / Roborazzi) catches visual regressions without a device.

**Soundbite:** "Compose tests query the semantics tree via a `ComposeTestRule` — finders, assertions, actions — with automatic recomposition sync; tag elements with `testTag` and prefer testing stateless composables."
