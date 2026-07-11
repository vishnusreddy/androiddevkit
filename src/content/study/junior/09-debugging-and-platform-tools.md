---
title: Debugging, inspection, and Android platform tools
description: Build a repeatable method for reproducing failures, reading evidence, inspecting application state, and verifying a fix on a real device.
level: junior
order: 9
duration: 55 min
quizHref: /practice/?test=android-fundamentals-test
quizLabel: Take the Android fundamentals quiz
---

Debugging is the discipline of reducing uncertainty with evidence. A crash log, a visual defect, a failed request, and an unexpected lifecycle callback are not separate kinds of problem. In each case, the engineer must establish the observed behavior, reproduce it under controlled conditions, collect the smallest useful evidence, form a falsifiable explanation, and verify the correction without creating a new regression.

Android adds important sources of variation: operating-system version, window size, locale, process lifetime, network state, permission state, and device manufacturer behavior. A correct fix therefore names the environment in which the fault occurred. “It works on my phone” is an observation, not a conclusion.

## Learning goals

By the end of this lesson, you should be able to:

- Write a minimal reproduction that distinguishes observation from assumption.
- Read a stack trace from the exception type to the first relevant application frame.
- Use Logcat, the debugger, and Android Debug Bridge to inspect a running application.
- Inspect the lifecycle, permissions, storage, and process state that influence a defect.
- Verify a fix across the state transition that originally failed.

## Start with a reproducible observation

A useful bug report describes a behavior that another person can attempt to reproduce:

| Weak report | Reproducible report |
|---|---|
| “The screen is broken.” | “On Android 14, open a shared PDF, rotate while the picker is visible, then return. The attachment row remains loading until the screen is reopened.” |
| “Login sometimes fails.” | “With an expired access token and valid refresh token, tapping Retry twice creates two refresh requests. The second request overwrites the first response.” |

Record the smallest set of facts that change the result:

1. Application version, device or emulator image, Android version, and account state.
2. Starting condition, exact actions, and expected versus actual result.
3. Frequency and whether the behavior depends on timing, connectivity, configuration, or a permission.
4. Evidence such as a stack trace, screenshot, network response class, or trace.

Do not begin by editing code. First make the failure predictable enough that a later change can be tested against the same condition.

## Read a stack trace as a causal path

An exception provides a type, message, and call stack. Start with the exception type and message, then find the first frame in your application package. Framework frames explain how Android reached your code, but the first relevant application frame usually identifies the violated assumption.

```text
java.lang.IllegalStateException: Fragment ProfileFragment did not return a View
    at androidx.fragment.app.FragmentStateManager.createView(...)
    at com.example.profile.ProfileFragment.onCreateView(ProfileFragment.kt:42)
```

This is not evidence that FragmentManager is defective. It says the `onCreateView` contract was violated at `ProfileFragment.kt:42`. Open that line, identify the condition that returned no view or used the wrong constructor, and write a test or manual reproduction for that condition.

For a crash caused by a nullable value, do not stop at “null pointer.” Ask why the value could be absent. It may be a missing deep-link argument, a process recreation path, a repository race, or an invalid assumption about a permission grant. The root cause is the earlier contract failure, not the final dereference.

## Use logs as structured evidence

Logcat contains application logs, system logs, crashes, and process events. Filter by the application process and a stable tag while reproducing a fault. A log line should state an event and the non-sensitive facts needed to interpret it.

```kotlin
private const val TAG = "AttachmentUpload"

Log.i(TAG, "enqueue id=$attachmentId source=$source")
Log.w(TAG, "upload failed id=$attachmentId category=${error.category}", error)
```

Avoid logging credentials, complete URLs containing tokens, document contents, email addresses, or raw server responses. Logging is a diagnostic channel with privacy and retention consequences. For production telemetry, prefer a classified outcome such as `timeout`, `unauthorized`, or `parse_error` over unbounded exception text.

Use log levels consistently:

- `VERBOSE` and `DEBUG` for local diagnostic detail that is normally disabled in release builds.
- `INFO` for meaningful lifecycle or business milestones during development.
- `WARN` for an unexpected but recoverable condition.
- `ERROR` for a failed operation that needs investigation. Include the throwable when it preserves the causal stack.

## Pause execution and inspect state

The debugger is most valuable when it answers a specific question. Set a breakpoint immediately before the suspected decision, reproduce the issue, then inspect values and the call stack. Step over a line to observe its result; step into only when the callee is relevant to the hypothesis.

For an incorrect screen state, inspect the state holder rather than only the composable or View. Check the input event, repository result, mapper output, and rendered model in order. This follows the data flow and prevents a visual symptom from hiding an upstream defect.

Use conditional breakpoints sparingly when a loop or callback fires frequently. For example, pause only when `item.id == expectedId`. A breakpoint that halts every frame can change scheduling enough to hide a race condition.

## Inspect the device deliberately

Android Debug Bridge, commonly invoked as `adb`, exposes information that the application UI cannot show. The following commands are useful during local investigation:

```bash
adb logcat --pid=$(adb shell pidof com.example.app)
adb shell dumpsys activity activities
adb shell dumpsys package com.example.app
adb shell am force-stop com.example.app
adb shell pm clear com.example.app
```

The first command narrows Logcat to the running process. `dumpsys activity activities` helps inspect the foreground task and Activity stack. `dumpsys package` shows package information, declared permissions, and granted runtime permissions. Force-stopping or clearing app data changes the test precondition. Use those commands intentionally and say which state has been reset.

Android Studio's App Inspection tools can inspect databases, network traffic where supported, and layout state. They complement, rather than replace, a written reproduction. The inspection view shows one moment in time; the reproduction explains why that moment occurred.

## Exercise state transitions that hide defects

Many Android failures occur between steady states. Test the transition, not only the final screen:

| Transition | Questions to ask |
|---|---|
| Rotation or size change | Does the new UI render from state without repeating a request or retaining the old view? |
| Background then foreground | Does visible work pause and resume correctly? Did a token or permission change? |
| Process death and restore | Can durable data reconstruct the screen? Is transient input restored only when appropriate? |
| Offline then online | Are requests retried according to policy? Does cached content remain coherent? |
| Permission denied or revoked | Does the feature explain the next action without assuming a grant? |
| Deep link into a feature | Are arguments validated and is required data reloaded safely? |

The developer options process limit and “Don't keep activities” setting can help expose recreation assumptions during development. They are stress tools, not substitutes for correct state ownership.

## Verify the fix and guard the contract

A fix is complete when the original reproduction no longer fails, nearby states still work, and the change has a durable guard. The guard may be a unit test for a state mapper, an instrumented test for a permission flow, a regression test for a parsing edge case, or a concise manual test recorded in the pull request.

Use this sequence:

1. Reproduce the defect on an unchanged build.
2. State the proposed cause in one sentence.
3. Make the smallest change that addresses that cause.
4. Re-run the original reproduction and one neighboring state.
5. Add a test when the contract can be expressed reliably.
6. Review logs, cleanup, and error messages for information or privacy leaks.

If the change only removes the visible symptom while the state model remains contradictory, the defect will return through another entry point.

## Common mistakes

1. Treating the last stack frame as the root cause without examining the violated earlier assumption.
2. Using a release-only report as an excuse not to reproduce the environment locally.
3. Leaving sensitive values in logs after the investigation.
4. Testing a happy path after a fix but not the state transition that exposed the defect.
5. Clearing application data without recording that the reproduction now starts from a different state.

## Practice checklist

1. Introduce a harmless state-mapping defect in a sample screen and write a five-step reproduction before correcting it.
2. Trigger and read a stack trace. Identify the exception type, first application frame, and violated assumption.
3. Use Logcat filtering and one `adb dumpsys` command to inspect an application you are running locally.
4. Rotate a stateful screen, force-stop the process, and compare what restores from the ViewModel, `SavedStateHandle`, and durable storage.
5. Add one behavior-focused regression test for a defect you have diagnosed.

## What you should be able to explain

- Why reproducibility is the first debugging deliverable.
- How to read a stack trace from failure symptom to the first relevant application frame.
- The difference between inspecting a value and proving the cause of a value.
- Which Android state transitions are likely to reveal lifecycle and ownership defects.
- How a regression test or documented manual check protects the corrected contract.
