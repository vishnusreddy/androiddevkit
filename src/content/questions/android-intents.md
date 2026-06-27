---
question: "Explicit vs implicit Intents, and how do intent filters work?"
topic: android-fundamentals
difficulty: junior
tags: ["intents", "components"]
---

An **Intent** is a messaging object to request an action from a component (start an Activity/Service, deliver a broadcast).

**Explicit intent** — names the exact target component. Used **within your app**.
```kotlin
startActivity(Intent(this, DetailActivity::class.java).putExtra("id", 42))
```

**Implicit intent** — describes an **action**, and the system finds a component (often in another app) that can handle it via **intent filters**.
```kotlin
startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://example.com")))
startActivity(Intent(Intent.ACTION_SEND).apply {
    type = "text/plain"; putExtra(Intent.EXTRA_TEXT, "Hi")
})
```

**Intent filters** (in the manifest) declare what implicit intents a component accepts, matched on **action**, **category**, and **data** (scheme/host/mimeType):
```xml
<activity android:name=".ShareActivity">
    <intent-filter>
        <action android:name="android.intent.action.SEND"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <data android:mimeType="text/plain"/>
    </intent-filter>
</activity>
```

**Points interviewers want:**
- **Always verify** an implicit intent resolves (`resolveActivity` / wrap in try-catch) or no app may handle it.
- Modern Android requires **`<queries>`** in the manifest (package visibility) to query/launch other apps' intents on API 30+.
- **Deep links / App Links** are implicit `ACTION_VIEW` intents with a `<data>` URL filter; verified App Links open your app directly without a chooser.
- Extras pass data via `putExtra`/`getXxxExtra`; complex objects need `Parcelable`.

**Soundbite:** "Explicit = named target (inside your app); implicit = action + intent-filter matching (often other apps). Always check resolution and declare `<queries>` on API 30+."
