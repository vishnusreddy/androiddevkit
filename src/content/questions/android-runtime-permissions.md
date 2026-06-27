---
question: "How do runtime permissions work, and what are the modern best practices?"
topic: android-fundamentals
difficulty: junior
tags: ["permissions", "security"]
---

Since **Android 6 (Marshmallow)**, **dangerous** permissions (location, camera, contacts, microphone) must be requested **at runtime**, not just declared in the manifest. Normal permissions (internet, vibrate) are granted at install.

The flow with the modern **Activity Result API**:
```kotlin
val launcher = registerForActivityResult(RequestPermission()) { granted ->
    if (granted) startCamera() else showRationaleOrSettings()
}

when {
    checkSelfPermission(CAMERA) == PERMISSION_GRANTED -> startCamera()
    shouldShowRequestPermissionRationale(CAMERA) -> showRationale { launcher.launch(CAMERA) }
    else -> launcher.launch(CAMERA)
}
```

**Key behaviors & best practices:**
- **Request in context, just-in-time** - ask for the camera permission when the user taps "take photo," not at app launch. Show **rationale** if the user previously denied.
- **`shouldShowRequestPermissionRationale`** returns true after one denial; if the user selects "Don't ask again" (or denies twice on Android 11+), the system **auto-denies** and you must guide them to **Settings**.
- **Location tiers** - `ACCESS_COARSE`/`FINE`, and **background** location (`ACCESS_BACKGROUND_LOCATION`) must be requested **separately** and is heavily scrutinized.
- **One-time & approximate location** (Android 10/12+) - users can grant "only this time" or coarse-only; handle partial grants.
- **New granular media permissions** (Android 13+): `READ_MEDIA_IMAGES/VIDEO/AUDIO` replace `READ_EXTERNAL_STORAGE`; Android 14 adds **partial** photo access (selected photos).
- **Don't over-ask** - Play flags apps that request sensitive permissions without justification; use **scoped storage**, the **Photo Picker**, and `CameraX`'s system UI to avoid needing some permissions at all.
