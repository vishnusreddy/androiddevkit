---
question: "How do you test navigation, arguments, and deep links?"
topic: testing-quality
difficulty: mid
order: 90
starred: false
section: "UI and navigation"
tags: ["testing", "navigation", "deep-links", "compose"]
---

Test navigation at three seams instead of asserting every internal call.

**Destination UI:** render the screen with state and callbacks. Click the UI and
assert that the navigation callback receives the correct typed ID or route. The
screen test should not need a real `NavController`.

**Graph integration:** attach a test navigation controller to the graph, perform
an action, and assert the current destination plus decoded arguments. Cover
back-stack behavior, nested graphs, saved state, and invalid or missing input.

**Deep-link entry:** launch the public URI through the actual Activity or
navigation graph. Verify the destination, authentication redirect, argument
validation, and back behavior. Include a cold start and an already-running app.

Prefer typed routes or a small navigator interface over building route strings
throughout the UI. That makes encoding and argument validation testable in one
place.

Do not stop at "the destination ID changed." A useful test also proves that the
destination received the right data and that Up or Back returns the user to the
expected place. Use a device-level test when App Links verification, another
app, or system intent resolution is part of the behavior.
