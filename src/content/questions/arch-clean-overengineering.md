---
question: "When does Clean Architecture become over-engineering?"
topic: architecture
difficulty: mid
order: 235
starred: false
section: "Architecture judgment"
tags: ["clean-architecture", "trade-offs", "over-engineering", "maintainability"]
---

Clean Architecture becomes over-engineering when its ceremony costs more than
the volatility or complexity it protects against.

Warning signs include:

- One-line use cases that only forward every repository call.
- Identical DTO, entity, domain, and UI models with mechanical mapping at every
  layer.
- An interface and implementation for every class without multiple consumers,
  ownership boundaries, or substitution needs.
- Dozens of tiny Gradle modules that increase configuration and navigation
  wiring without improving build isolation or team ownership.
- Business rules spread across mappers and wrappers because code must pass
  through a prescribed number of layers.
- Developers cannot trace a simple user action without opening many files.

Start with clear UI and data layers, immutable state, repositories, and explicit
construction. Add a use case when it coordinates repositories, is reused, owns
an important rule, or makes a state holder materially simpler. Split models when
their meanings, lifetimes, trust boundaries, or rates of change differ. Add a
module when it provides measurable encapsulation, ownership, reuse, or build
benefit.

Removing a layer is not abandoning architecture. Good architecture minimizes
the cost of change. Sometimes the cleanest design is a ViewModel calling a
well-designed repository directly.

In an interview, state the current constraints and the trigger that would make
you add the next boundary. That shows more judgment than drawing the maximum
number of layers from the start.
