---
title: "Open-source Android apps worth reading"
description: "A current, practical guide to Android codebases that teach architecture, testing, migration, media, privacy, and long-lived product development."
date: 2026-06-15
author: "AndroidDevKit"
tags: ["open-source", "learning"]
heroImage: "/blog/open-source-android-apps.jpg"
heroAlt: "An Android phone connected to code modules, tests, interface layers, and databases"
---

A large repository is not automatically a good teacher. Some are brilliant but
too specialised for a first read. Others are samples designed to demonstrate one
opinion, not products that have survived years of users and migrations.

The list below mixes both. The important bit is knowing which kind you are
looking at.

## Pick a repository for the question you have

| Repository | Best for | Keep in mind |
| --- | --- | --- |
| [Now in Android](https://github.com/android/nowinandroid) | Modern Compose architecture, offline-first data, modularisation, tests | A reference app built to teach recommended patterns |
| [Thunderbird for Android](https://github.com/thunderbird/thunderbird-android) | Long-lived product code, email protocols, migrations, architecture records | Large Kotlin and Java codebase with years of history |
| [DuckDuckGo Android](https://github.com/duckduckgo/Android) | Feature modules, browser integration, privacy features | A production browser with a broad surface area |
| [Signal Android](https://github.com/signalapp/Signal-Android) | Reliability, messaging, media, background work, security-sensitive design | Advanced codebase; do not treat cryptography as copy-paste material |
| [Mihon](https://github.com/mihonapp/mihon) | Image-heavy UI, downloads, local libraries, extension boundaries | Active successor in the ecosystem after Tachiyomi ended |
| [NewPipe](https://github.com/TeamNewPipe/NewPipe) | Playback, streaming, offline media, running without Play Services | The project is undergoing a major refactor; check the active branch and contribution notes |
| [Compose samples](https://github.com/android/compose-samples) | Focused examples of adaptive UI, animation, state, and testing | Samples, not one production application |

## What each repository can teach you

### Now in Android: a map of modern Android guidance

Start here when you want to see Hilt, Room, WorkManager, Compose, modularisation,
baseline profiles, and screenshot tests working together. The repository even
includes an [architecture learning
journey](https://github.com/android/nowinandroid/blob/main/docs/ArchitectureLearningJourney.md)
that traces the data flow.

Do not copy the module graph into a small personal app. Ask why it exists. A
reference app deliberately demonstrates more infrastructure than many small apps
need.

### Thunderbird for Android: how a product carries history

Thunderbird for Android grew from K-9 Mail. That makes it useful for studying
migration, compatibility, multiple app variants, and the boundary between old and
new code. Its repository includes architecture decision records, which are often
more educational than the final classes because they explain the trade-offs.

### DuckDuckGo Android: a large Kotlin product

This is a good place to trace one privacy or browser feature across modules. Look
at the seams around WebView, feature flags, experiments, and platform APIs. Do not
try to understand the whole browser at once.

### Signal Android: correctness under pressure

Signal is worth reading for database work, background processing, notifications,
media, and a mature build. It is also easy to misunderstand. Security-sensitive
code is shaped by requirements that may not be obvious from one file. Read design
discussion and tests alongside the implementation, and never transplant
cryptographic code into an app because it "looked right."

### Mihon: the current project, not the discontinued Tachiyomi app

The original Tachiyomi project stopped development in 2024. Recommending it as an
active project is stale advice. [Mihon](https://github.com/mihonapp/mihon) is an
active open-source reader in that lineage. It is useful for image loading, local
libraries, downloads, backups, and a sizeable Compose UI.

### NewPipe: learn from the transition as well as the code

NewPipe handles streaming, playback, downloads, local data, and devices without
Google Play Services. Its maintainers are also rewriting substantial parts of the
project, while the older codebase is largely in maintenance mode. That is not a
reason to avoid it. It is a reason to check the README, active branch, and issue
context before drawing conclusions from one implementation.

### Compose samples: answer one focused UI question

Use the official samples when your question is narrow: adaptive navigation,
custom layout, animation, state, or UI testing. They are easier to run than a
full production app, but they do not demonstrate every operational concern of a
real product.

## Trace one feature instead of browsing folders

Pick a visible behaviour such as bookmarking an article or marking a message as
read. Then follow it in one direction:

<div class="article-flow" role="img" aria-label="A feature traced from user action through the app layers and back to rendered state">
  <div class="flow-step"><span>1</span><strong>User action</strong><small>Tap, type, refresh</small></div>
  <span class="flow-arrow">→</span>
  <div class="flow-step"><span>2</span><strong>State holder</strong><small>ViewModel or presenter</small></div>
  <span class="flow-arrow">→</span>
  <div class="flow-step"><span>3</span><strong>Data boundary</strong><small>Repository or use case</small></div>
  <span class="flow-arrow">→</span>
  <div class="flow-step"><span>4</span><strong>Source</strong><small>Database, network, system</small></div>
  <span class="flow-arrow">→</span>
  <div class="flow-step"><span>5</span><strong>Rendered state</strong><small>Loading, content, error</small></div>
</div>

Write down three things as you go:

- Where the source of truth lives.
- How errors and cancellation travel back to the UI.
- Which part you would test without an emulator.

Then run the app and put breakpoints on that path. Reading becomes far less
abstract once you watch the state move.

## Reading and contributing are different decisions

A repository can be excellent to study and a poor choice for a first pull
request. Before contributing, read its current contribution guide, recent pull
requests, and maintainer responses. The companion guide on [finding an Android
open-source contribution](/blog/exciting-android-projects-to-contribute-on/)
covers that decision separately.

