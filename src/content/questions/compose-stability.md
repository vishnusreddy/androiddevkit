---
question: "What does stability mean in Compose, and how does strong skipping change the answer?"
topic: jetpack-compose
difficulty: senior
order: 10
starred: true
section: "Performance and runtime"
tags: ["compose", "stability", "performance", "recomposition"]
---

Stability tells the Compose compiler whether it can reliably detect changes to a
value. A stable type has a consistent equality contract, and Compose can observe
changes to any mutable public state it exposes.

Examples that are normally stable include primitives, `String`, function types,
and immutable data classes whose properties are also stable. Standard `List`,
`Set`, and `Map` interfaces are treated as unstable because the compiler cannot
prove that an implementation is immutable.

Strong skipping changes an older interview answer. Since Kotlin 2.0.20 it is
enabled by default. Restartable composables with unstable parameters can still
be skipped. Stable parameters are compared with object equality, while unstable
parameters are compared with instance equality.

```kotlin
@Composable
fun Feed(items: List<FeedItem>) { /* ... */ }
```

`List` is unstable, but with strong skipping `Feed` can be skipped when the exact
same list instance is passed again. A newly allocated equal list is a different
instance, so it will not be skipped on that basis.

Possible improvements include:

- expose truly immutable models
- use `kotlinx.collections.immutable` when it fits the codebase
- use a stability configuration for types whose contract you control
- add `@Immutable` or `@Stable` only when the type really satisfies that promise

Annotations are contracts with the compiler, not magic fixes. Marking a wrapper
`@Immutable` while it exposes a list that callers can mutate can produce stale
UI.

Most importantly, diagnose a real performance issue before redesigning models.
Use compiler reports to understand inferred stability, then confirm the cost in
a trace or benchmark. An unstable parameter is information, not proof that the
screen is slow.
