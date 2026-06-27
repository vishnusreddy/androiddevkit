---
question: "What is the difference between local and instrumented tests on Android?"
topic: testing-quality
difficulty: junior
tags: [testing, junit, instrumentation]
---

**Local tests** run on the JVM on your development machine. They are fast and
work well for business logic, mappers, reducers, and ViewModels whose Android
dependencies have been kept behind interfaces.

**Instrumented tests** run on an Android device or emulator. Use them when the
behavior depends on the framework, such as navigation, permissions, resources,
Room integration, or a complete UI flow. They provide more realism but are
slower and need more setup.

Robolectric sits between the two: it runs Android-like behavior on the JVM. It
can be useful, but it is not a replacement for every device test.

A good default is to keep most tests local, add integration tests at important
boundaries, and reserve device tests for behavior that genuinely requires
Android.
