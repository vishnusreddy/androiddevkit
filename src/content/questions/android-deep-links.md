---
question: "How do deep links and Android App Links work?"
topic: android-fundamentals
difficulty: mid
tags: ["deep-links", "app-links", "navigation"]
---

A **deep link** is a URI that opens a specific screen in your app. There are tiers:

**1. Basic deep link** - an intent filter on `ACTION_VIEW` with a custom scheme or http(s):
```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW"/>
    <category android:name="android.intent.category.DEFAULT"/>
    <category android:name="android.intent.category.BROWSABLE"/>
    <data android:scheme="https" android:host="example.com" android:pathPrefix="/item"/>
</intent-filter>
```
Problem: for a plain web link, Android may show a **disambiguation chooser** ("open with browser or app?").

**2. Android App Links** (verified http(s) links) - the upgrade. Add `android:autoVerify="true"` and host a **`assetlinks.json`** Digital Asset Links file at `https://example.com/.well-known/assetlinks.json` listing your app's package and signing fingerprint. Android verifies ownership, so the link opens your app **directly, no chooser**.

**3. Custom scheme** (`myapp://`) - works but isn't web-clickable and any app can claim the scheme; fine for internal/OAuth redirects, not for sharing.

**Handling them:**
- Read the `Intent.data` URI in the target Activity (and handle **`onNewIntent`** for `singleTop`).
- **Navigation Compose / Nav component** support deep links declaratively (`navDeepLink { uriPattern = ... }`), routing the URI to the right destination and building a proper back stack.

**What to remember:**
- **App Links (verified) vs deep links (unverified):** App Links skip the chooser via `assetlinks.json` domain verification; plain deep links may prompt.
- Handle parameters/IDs from the URI, validate them, and build a sensible back stack (`TaskStackBuilder` / nav graph) so Back works.
- Test with `adb shell am start -a android.intent.action.VIEW -d "https://example.com/item/42"`.
