---
question: "Why was startActivityForResult deprecated, and how does the Activity Result API work?"
topic: android-fundamentals
difficulty: mid
tags: ["activity-result", "lifecycle"]
---

`startActivityForResult` + `onActivityResult` had real problems:
- **Scattered logic** - you launched in one place and handled the result in a giant `onActivityResult` `when(requestCode)`, far from the call site.
- **Manual requestCode management** - error-prone integer juggling.
- **Process-death unsafe** - the callback could be lost; state was hard to preserve.
- **Tight coupling** to Activity/Fragment internals.

The **Activity Result API** replaces it with type-safe, lifecycle-aware contracts:

```kotlin
// Register at construction time (not after STARTED)
private val pickImage = registerForActivityResult(
    ActivityResultContracts.GetContent()
) { uri: Uri? ->
    uri?.let { showImage(it) }      // result handled right here
}

// Launch from anywhere
button.setOnClickListener { pickImage.launch("image/*") }
```

Benefits:
- **Type-safe contracts** - `GetContent`, `TakePicture`, `RequestPermission`, `RequestMultiplePermissions`, `StartActivityForResult`, or a **custom `ActivityResultContract`** with typed input/output. No requestCodes, no manual `Intent` parsing.
- **Result handled at the call site** - the callback lives next to where you launch.
- **Lifecycle-aware & process-death safe** - the registry survives recreation and re-delivers results; you **must register before** the lifecycle reaches STARTED (i.e. as a field / in `onCreate`).
- Decoupled - works the same in Activities, Fragments, and even non-UI components via an `ActivityResultRegistry`.

**Common contracts:** runtime **permissions** (`RequestPermission`), picking content/photos, taking a picture, and `StartIntentSenderForResult`.
