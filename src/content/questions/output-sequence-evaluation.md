---
question: "In what order does a Kotlin Sequence run filter and map?"
topic: code-snippet-output
difficulty: junior
order: 10
starred: true
section: "Collections and evaluation"
tags: ["kotlin", "output-based", "sequences", "collections"]
---

```kotlin
val result = sequenceOf(1, 2, 3, 4)
    .filter {
        println("filter $it")
        it % 2 == 0
    }
    .map {
        println("map $it")
        it * 10
    }
    .take(1)
    .toList()

println(result)
```

**Output:**

```text
filter 1
filter 2
map 2
[20]
```

A `Sequence` is lazy. It takes one element through the pipeline at a time and
stops as soon as `take(1)` has one result. Element `1` fails the filter. Element
`2` passes, gets mapped to `20`, and the sequence has done enough work.

With a regular `List`, `filter` would inspect all four values before `map`
starts. That difference is the point of the question.

**How to reason about it:** find the terminal operation first. Here it is
`toList()`. Then move one element at a time through the intermediate operations.
