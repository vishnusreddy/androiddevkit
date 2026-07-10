---
title: "Activities: an Android screen's entry point"
description: Understand what an Activity owns, how Android creates it, and why it should stay thin.
level: junior
order: 2
duration: 45 min
quizHref: /practice/?test=android-fundamentals-test
quizLabel: Take the fundamentals quiz
---

An **Activity** is an Android component that provides a window where your app can show a screen. Android creates it in response to an explicit intent, a launcher tap, a deep link, or task restoration. Your code does not call an Activity constructor as the normal entry path. The operating system controls its lifecycle and may create a new instance when you did not expect it - after rotation, locale change, or process death recovery.

Modern apps often use a **single-Activity** architecture: one Activity hosts many Compose destinations or Fragments. Even then, you must understand what that Activity owns, how intents deliver data, and how tasks and the back stack work.

## Learning goals

- Explain what an Activity is responsible for - and what it should not own.
- Trace how an intent starts an Activity and how extras are read safely.
- Describe tasks, the back stack, and common launch-mode pitfalls at a junior level.
- Keep Activities thin: theme, content, navigation host, system callbacks - not network or business rules.

## What an Activity is

From the platform’s point of view, an Activity is one of the four application components (with Service, BroadcastReceiver, and ContentProvider). It is declared in the **manifest**, may have intent filters (launcher, deep links), and participates in the system’s task model.

```xml
<activity
    android:name=".MainActivity"
    android:exported="true"
    android:windowSoftInputMode="adjustResize">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

`android:exported` must be explicit for components with intent filters. Launcher Activities are exported; internal Activities that only receive explicit intents from your app should not be.

## What an Activity should own

An Activity is a good home for **window-scoped setup**:

- Applying the app theme / edge-to-edge window configuration
- Setting the content view (XML, View Binding, or `setContent { }` for Compose)
- Hosting a NavHost / Fragment container
- Registering Activity Result contracts (runtime permissions, photo picker, document open)
- Forwarding system events (new intent, configuration hints) into navigation or a ViewModel

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            AppTheme {
                AppNavHost()
            }
        }
    }
}
```

### What it should not own

- Network calls and database queries
- Business rules (“can this user checkout?”)
- Long-lived state that must survive rotation without a ViewModel / saved state

Those responsibilities belong in ViewModels, use cases / repositories, and durable storage. An Activity that becomes a god-class is hard to test and dies with every configuration change unless you carefully stash everything.

## How Android creates an Activity

Typical path for a cold start of the launcher Activity:

1. User taps the icon (or a deep link resolves to your app).
2. The system starts your process if needed (Zygote → your `Application`).
3. The system creates the Activity instance and calls lifecycle methods beginning with `onCreate`.
4. Your `onCreate` sets up the UI.

You never `new MainActivity()` yourself for production navigation. You request the system to start it via an **Intent**.

## Intents: explicit, implicit, and extras

### Explicit intents

Target a specific component in your app:

```kotlin
val intent = Intent(this, DetailActivity::class.java).apply {
    putExtra(EXTRA_ARTICLE_ID, articleId)
}
startActivity(intent)
```

### Implicit intents

Declare an action and let the system resolve a handler (share sheet, browser, maps):

```kotlin
val send = Intent(Intent.ACTION_SEND).apply {
    type = "text/plain"
    putExtra(Intent.EXTRA_TEXT, shareUrl)
}
startActivity(Intent.createChooser(send, null))
```

Always handle the case that nothing can resolve the intent (`resolveActivity` / try-catch around start, depending on API level and policies).

### Reading extras safely

```kotlin
class DetailActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val id = intent.getStringExtra(EXTRA_ARTICLE_ID)
        if (id.isNullOrBlank()) {
            finish()
            return
        }
        // hand id to ViewModel / navigation args
    }
}
```

Prefer **type-safe navigation arguments** (Navigation component, Compose Navigation) over raw string keys when you can. Still understand raw extras - interviewers and legacy code use them.

### `onNewIntent`

If an existing Activity instance receives another intent (common with `singleTop` / launcher re-entry), `onCreate` is **not** called again. Override `onNewIntent` and call `setIntent(intent)` so later `getIntent()` reflects the latest data:

```kotlin
override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
    handleIntent(intent)
}
```

## Tasks, back stack, and launch modes (junior depth)

- A **task** is a stack of Activities the user can move through with Back.
- **Back** pops the top Activity (or finishes the app’s task when the stack is empty, depending on system behavior and whether you intercept back).
- Launch modes (`standard`, `singleTop`, `singleTask`, `singleInstance`) change whether a new instance is created or an existing one is reused.

Junior-level expectations:

| Mode | Intuition |
|------|-----------|
| `standard` (default) | New instance every time |
| `singleTop` | Reuse if already on top; delivers `onNewIntent` |
| `singleTask` | Reuse in task; may clear Activities above it |

Prefer the Navigation component’s back stack over hand-rolling launch-mode tricks. Know that **deep links** and **notification taps** often create surprising stacks if you do not design the entry path.

## Activity Result API

The modern replacement for `startActivityForResult` is the Activity Result API:

```kotlin
private val pickImage = registerForActivityResult(
    ActivityResultContracts.GetContent()
) { uri: Uri? ->
    if (uri != null) viewModel.onImagePicked(uri)
}

// somewhere in a click handler
pickImage.launch("image/*")
```

Register contracts before the Activity is `STARTED` (typically as a property initializer or in `onCreate` before `STARTED`). Do not register only in a click listener after the lifecycle has moved on - you will crash or miss results.

## Configuration changes and why “thin” matters

When the user rotates the device (and you have not disabled config changes), Android **destroys and recreates** the Activity. Anything stored only in Activity fields is gone unless you:

- Hold it in a **ViewModel** (survives configuration change),
- Persist it in **SavedStateHandle** / `onSaveInstanceState` (survives process death for small state),
- Or reload it from a durable source (database, DataStore).

This is why network calls and screen state belong outside the Activity instance.

```kotlin
// Fragile: lost on rotation
private var draft: String = ""

// Better: ViewModel retains draft across config change
class ComposerViewModel : ViewModel() {
    var draft: String = ""
}
```

Process death is a separate, harder problem - covered in the lifecycle lesson.

## Single-Activity architecture

Most greenfield apps use one Activity as a window-level host for a navigation graph:

![Single-Activity navigation structure](/diagrams/single-activity.svg)

Benefits:

- Shared window setup, theme, and system bar handling in one place
- Navigation as a graph, not a mesh of `startActivity` calls
- Easier predictive back and deep link modeling

You may still use multiple Activities for separate tasks (e.g. a picture-in-picture player, authentication in a different task affinity, or a library that forces it). Know the default recommendation without treating it as dogma.

## Manifest details juniors should recognize

- **`android:exported`**: required for intent-filter components; security-sensitive.
- **`android:launchMode`**: stack behavior.
- **`android:windowSoftInputMode`**: keyboard vs layout (`adjustResize` / `adjustPan`).
- **`android:configChanges`**: only handle yourself if you truly know what you are doing; usually let the system recreate.
- **Theme / splash**: `SplashScreen` API and theme attributes on the launcher Activity.

## Common pitfalls

1. **Doing I/O in `onCreate` on the main thread** - jank and ANR risk.
2. **Leaking Activity context** into singletons, static fields, or coroutines that outlive the Activity.
3. **Ignoring `savedInstanceState`** when restoring UI that is not in a ViewModel.
4. **Assuming `onCreate` runs for every intent** - false for `onNewIntent` cases.
5. **Putting business logic in the Activity** so unit tests require Robolectric or instrumentation for no good reason.

## How interviewers probe this

- “What is an Activity?” - component + window + system-managed lifecycle.
- “Difference between explicit and implicit intents?”
- “What happens on rotation?” - destroy/recreate; ViewModel survives; process death is different.
- “Why single-Activity?” - navigation, shared window, modern Compose/Fragment hosts.
- “How do you return a result from another screen?” - Activity Result API.

## Practice checklist

1. Start a second Activity with an extra; read it safely; finish if missing.
2. Register a `GetContent` contract and display the picked URI.
3. Put a counter in an Activity field, rotate, observe the loss; move it to a ViewModel and confirm it survives.
4. Sketch your favorite app as one Activity + navigation destinations.

## What you should be able to explain

- System ownership of Activity instances and why constructors are not your API.
- Thin Activity vs fat Activity failure modes.
- Intent delivery, extras, and `onNewIntent`.
- How configuration change interacts with Activity-held state.

Next: **Fragments** - reusable UI pieces with a *view* lifecycle that is not the same as the Fragment instance lifecycle.
