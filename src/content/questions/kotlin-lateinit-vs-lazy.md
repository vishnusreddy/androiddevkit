---
question: "lateinit vs lazy - what's the difference and when do you use each?"
topic: kotlin
difficulty: mid
order: 40
starred: true
section: "Classes and modeling"
tags: ["kotlin", "lateinit", "lazy", "initialization"]
---

Both defer initialization, but they're for different situations.

**`lateinit var`**
- A `var` you promise to set before first use. No initial value.
- Only for **non-null, non-primitive** types (`var x: Int` won't work).
- Accessing it before assignment throws `UninitializedPropertyException`.
- You can reassign it and check `::x.isInitialized`.
- Use when something injects/sets the value later - Dagger fields, `onCreate` views/binding, test setup.

```kotlin
private lateinit var binding: ActivityMainBinding
override fun onCreate(savedInstanceState: Bundle?) {
    binding = ActivityMainBinding.inflate(layoutInflater)
}
```

**`by lazy`**
- A `val` computed **once, on first access**, then cached.
- Thread-safe by default (`LazyThreadSafetyMode.SYNCHRONIZED`); you can relax it.
- Use for expensive, read-only values you might not even need.

```kotlin
val database by lazy { Room.databaseBuilder(...).build() }
```

**Quick decision:** mutable + set-externally-later → `lateinit`; read-only + compute-on-demand → `lazy`. And remember `lateinit` can't be used with primitives or nullable types, while `lazy` can hold anything.
