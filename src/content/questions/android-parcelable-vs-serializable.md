---
question: "Parcelable vs Serializable on Android - why is Parcelable preferred?"
topic: android-fundamentals
difficulty: mid
tags: ["parcelable", "serializable", "performance"]
---

Both let you pass objects between components (in `Intent` extras / `Bundle`), but they work very differently.

- **`Serializable`** - Java's reflection-based marker interface. Easy (just `implements Serializable`), but **slow**: it uses **reflection** and creates lots of temporary objects/garbage, hurting performance and GC.
- **`Parcelable`** - Android's IPC-optimized serialization. You define how to flatten/restore the object explicitly, so it's **much faster** (no reflection) - the right choice for Android.

**The pain point Parcelable used to have** was boilerplate (`writeToParcel`, `CREATOR`, `describeContents`). Kotlin removes it with **`@Parcelize`**:

```kotlin
@Parcelize
data class User(val id: Int, val name: String) : Parcelable
// that's it - writeToParcel/CREATOR are generated
```

**What to remember:**
- Prefer **`Parcelable` (`@Parcelize`)** for anything passed via Intents/Bundles - it's faster and the platform standard.
- `Parcel` is for **in-memory IPC / transient transport**, **not** persistence - never write a Parcel to disk or rely on its format across versions.
- There's a **Binder transaction size limit** (~1MB for `TransactionTooLargeException`) - don't pass large objects/bitmaps through Intents; pass an **ID** and load the data, or use a shared repository.
- For passing data between **navigation destinations**, pass IDs, not big Parcelables.
