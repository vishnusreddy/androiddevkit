---
question: "Explain the Builder pattern. Is it still needed in Kotlin?"
topic: architecture
difficulty: junior
tags: ["design-patterns", "builder", "kotlin"]
---

The **Builder pattern** constructs a complex object **step by step**, avoiding telescoping constructors (many overloads) and making optional parameters readable.

```java
// Java: classic builder
Notification n = new NotificationCompat.Builder(context, channelId)
    .setContentTitle("Hi")
    .setContentText("Body")
    .setSmallIcon(R.drawable.ic)
    .setAutoCancel(true)
    .build();
```

**Where it appears in Android:** `NotificationCompat.Builder`, `AlertDialog.Builder`, `Retrofit.Builder`, `OkHttpClient.Builder`, `Room.databaseBuilder`, `WorkRequest.Builder`, `Intent` (chained `putExtra`). These predate Kotlin or come from Java APIs.

**Is it still needed in Kotlin?** Often **not** - Kotlin's **default and named arguments** replace most builders:
```kotlin
data class RequestConfig(
    val url: String,
    val timeout: Long = 30_000,
    val retries: Int = 3,
    val headers: Map<String, String> = emptyMap(),
)
RequestConfig(url = "...", retries = 5)   // no builder needed
```

For more builder-like ergonomics, Kotlin uses:
- **`apply { }`** to configure an object fluently.
- **Type-safe DSL builders** - a lambda with receiver (`buildString { }`, `Modifier` chains, Gradle Kotlin DSL) - the idiomatic Kotlin "builder."

**When a builder still earns its place in Kotlin:**
- **Java interop** - your API is consumed from Java (no default args there).
- **Step-by-step validation** or enforcing a build order / required-before-optional sequencing.
- Mirroring an established API style for familiarity.
