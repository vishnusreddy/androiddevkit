---
question: "What are the uses of the object keyword in Kotlin?"
topic: kotlin
difficulty: mid
tags: ["kotlin", "object", "singleton"]
---

`object` creates a class **and** its single instance at once. It has three uses:

**1. Singleton (object declaration)**
```kotlin
object Analytics {
    fun track(event: String) { /* ... */ }
}
Analytics.track("open")   // thread-safe, lazily created on first access
```

**2. Companion object** — a singleton tied to a class, called via the class name (factories, constants).

**3. Object expression (anonymous object)** — Kotlin's answer to anonymous classes:
```kotlin
view.setOnClickListener(object : View.OnClickListener {
    override fun onClick(v: View?) { /* ... */ }
})

// or an ad-hoc object holding state
val point = object {
    val x = 1
    val y = 2
}
```

**Things to know:**
- An object declaration is initialized **lazily and thread-safely** on first use.
- Unlike a class, you can't have a constructor (it takes no parameters).
- An anonymous object's *type* is only visible locally — if returned from a public function it's seen as its supertype.

**Android note:** an `object` singleton holding a `Context` is a classic memory leak — store `applicationContext`, never an Activity.
