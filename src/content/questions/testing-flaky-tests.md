---
question: "What makes an Android test flaky, and how do you fix it?"
topic: testing-quality
difficulty: mid
tags: [testing, reliability, concurrency, ci]
---

A flaky test passes and fails without a relevant code change. Common causes are
real time, uncontrolled dispatchers, shared state, network calls, animations,
device differences, and assertions that run before the UI or background work is
idle.

Start by reproducing the failure repeatedly and recording the seed, device, and
logs. Then remove the uncontrolled dependency:

- Use virtual time for coroutines instead of `delay` or `Thread.sleep`.
- Inject clocks, dispatchers, IDs, and external services.
- Reset databases, files, and singletons between tests.
- Use Compose or Espresso synchronization instead of fixed waits.
- Give each test its own data and avoid depending on execution order.

Retries may reduce CI noise, but they do not fix the test. Quarantine can be a
short-term containment step only when the failure has an owner and a deadline.
