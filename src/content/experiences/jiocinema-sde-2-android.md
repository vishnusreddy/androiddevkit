---
company: "JioCinema"
role: "SDE 2 - Android"
level: "Mid"
outcome: "Rejected"
date: 2026-06-27
author: "Anonymous"
tags: ["coroutines", "kotlin", "reject"]
---

## Interview Experience

I interviewed for the SDE 2 Android role at JioCinema.

I was asked to determine the output of this function:

```kotlin
fun main() = runBlocking {
    launch {
        println("Coroutine with delay starts")
        delay(1000L)
        println("Coroutine with delay ends")
    }
    launch {
        println("Coroutine with Thread.sleep starts")
        Thread.sleep(1000L)
        println("Coroutine with Thread.sleep ends")
    }
    println("Main program continues...")
}
```

Additionally, the final technical question was about handling multiple API calls.

I had to build a suspend function that would return data. The function needed to
make two API calls using two `launch { }` blocks, similar to the function above,
where the output of the first API call was required for the second API call. The
function should return the results of both APIs, or return an error if either call
failed.

I was able to solve the first problem by explaining the printed output, but I had
no idea how to solve the second one.
