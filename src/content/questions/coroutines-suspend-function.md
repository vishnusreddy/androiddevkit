---
question: "What is a suspend function, and how does suspension actually work under the hood?"
topic: coroutines
difficulty: junior
tags: ["coroutines", "suspend", "internals"]
---

A `suspend` function is one that can **pause without blocking the thread** and resume later. The keyword is a contract: it can only be called from another suspend function or a coroutine.

**Under the hood - Continuation Passing Style (CPS):** the compiler rewrites a suspend function to take an extra hidden parameter, a `Continuation` (a callback for "what to do when I resume"). The function body is transformed into a **state machine**: each suspension point is a state, and local variables are saved on the continuation object.

```kotlin
suspend fun loadUser(): User {
    val token = auth()      // suspension point 1
    val user = api(token)   // suspension point 2
    return user
}
```

Conceptually compiles to something like a `switch` over a `label`:
- State 0: call `auth(continuation)`, save label = 1, return `COROUTINE_SUSPENDED`.
- When `auth` completes, it invokes the continuation → re-enters at state 1, and so on.

**Why this matters:**
- Suspension **frees the thread** to do other work - that's how thousands of coroutines run on a small pool. A blocked thread sits idle; a suspended coroutine doesn't hold a thread.
- `suspend` alone doesn't move work off the main thread - you still need `withContext(Dispatchers.IO)` for blocking work. `suspend` means "can suspend," not "runs in the background."
- There's no magic threading; it's compiler-generated callbacks that *look* like sequential code.
