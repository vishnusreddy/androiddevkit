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
- **`shouldShowRequestPermissionRationale`** can tell you that an educational
  explanation is appropriate after a denial. A `false` result is ambiguous: it
  can mean the permission has never been requested or that the system will no
  longer show the dialog. Track whether you requested it, and offer Settings
  only when the user deliberately tries the blocked feature again.
- **Location tiers** - `ACCESS_COARSE`/`FINE`, and **background** location (`ACCESS_BACKGROUND_LOCATION`) must be requested **separately** and is heavily scrutinized.
- **One-time and approximate location** - one-time permission is available on
  Android 11+, and users on Android 12+ can grant approximate location even
  when the app requests precise access. Treat that partial grant as a supported
  outcome.
- **New granular media permissions** (Android 13+): `READ_MEDIA_IMAGES/VIDEO/AUDIO` replace `READ_EXTERNAL_STORAGE`; Android 14 adds **partial** photo access (selected photos).
- **Don't over-ask** - use scoped storage, the Photo Picker, Storage Access
  Framework, and appropriate system intents when they satisfy the use case
  without broad storage or media access.
