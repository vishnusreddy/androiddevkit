---
question: "Parcelable vs Serializable on Android - why is Parcelable preferred?"
topic: android-fundamentals
difficulty: mid
tags: ["parcelable", "serializable", "performance"]
---

Both let you pass objects between components (in `Intent` extras / `Bundle`), but they work very differently.

- **`Serializable`** - Java's general-purpose object serialization mechanism.
  It is convenient, but reflective graph serialization adds overhead and its
  long-term format carries compatibility and security concerns.
- **`Parcelable`** - Android's compact, IPC-oriented flattening contract. Its
  generated or explicit read/write order avoids reflective graph traversal and
  matches what Bundle and Binder APIs expect.

**The pain point Parcelable used to have** was boilerplate (`writeToParcel`, `CREATOR`, `describeContents`). Kotlin removes it with **`@Parcelize`**:

```kotlin
@Parcelize
data class User(val id: Int, val name: String) : Parcelable
// that's it - writeToParcel/CREATOR are generated
```

**What to remember:**
- Prefer primitive extras or stable IDs when that is all the destination needs.
  Use **`Parcelable` (`@Parcelize`)** for a small structured value that genuinely
  must cross an Android component or Binder boundary.
- `Parcel` is for **in-memory IPC / transient transport**, **not** persistence - never write a Parcel to disk or rely on its format across versions.
- There's a **Binder transaction size limit** (~1MB for `TransactionTooLargeException`) - don't pass large objects/bitmaps through Intents; pass an **ID** and load the data, or use a shared repository.
- For passing data between **navigation destinations**, pass IDs, not big Parcelables.
