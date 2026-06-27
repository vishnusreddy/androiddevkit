---
title: "How to make your first Android open-source contribution"
description: "How to find a healthy project, choose a useful first issue, and open a pull request that maintainers can realistically review."
date: 2026-06-20
author: "AndroidDevKit"
tags: ["open-source", "career"]
heroImage: "/blog/contribute-android-open-source.jpg"
heroAlt: "Developers reviewing separate code changes as they merge into one shared project"
---

An open-source contribution can show that you can read unfamiliar code, follow a
project's rules, respond to review, and finish a small change. That is useful
evidence for an early-career developer.

It is not a substitute for a job, and a merged pull request is not guaranteed.
Maintainers are often volunteers, priorities change, and a technically correct
patch may still be the wrong direction for the project. Go in to help and learn,
not to collect a badge for your resume.

## Start with project health, not star count

Before choosing an issue, spend ten minutes checking the repository:

- Was code merged recently?
- Do maintainers respond to issues and pull requests?
- Is there a current contribution guide?
- Can you build the project with the documented setup?
- Does the licence permit the kind of use you have in mind?
- Are newcomer labels actually active, or are those issues years old?

A popular repository with 400 waiting pull requests may be a worse first project
than a smaller app whose maintainers answer questions.

<div class="article-flow" role="img" aria-label="Contribution path from checking project health to responding to review">
  <div class="flow-step"><span>1</span><strong>Check the project</strong><small>Activity, guide, build</small></div>
  <span class="flow-arrow">→</span>
  <div class="flow-step"><span>2</span><strong>Reproduce one issue</strong><small>Confirm it still exists</small></div>
  <span class="flow-arrow">→</span>
  <div class="flow-step"><span>3</span><strong>Agree on scope</strong><small>Comment before large work</small></div>
  <span class="flow-arrow">→</span>
  <div class="flow-step"><span>4</span><strong>Make the smallest fix</strong><small>Code, tests, screenshots</small></div>
  <span class="flow-arrow">→</span>
  <div class="flow-step"><span>5</span><strong>Open and support the PR</strong><small>Explain, revise, wait</small></div>
</div>

## Projects worth checking today

These repositories currently publish contribution information, but that does not
mean any random feature will be accepted. Read the linked guidance before coding.

### Thunderbird for Android

[Thunderbird for Android](https://github.com/thunderbird/thunderbird-android)
explicitly welcomes contributions and points newcomers toward development,
translation, and community channels. It has Kotlin and Java, clear architecture
records, and a long product history. That makes it good for learning, though the
initial build is not tiny.

### Mihon

[Mihon](https://github.com/mihonapp/mihon) says pull requests are welcome and asks
contributors to discuss major changes first. It is a useful option if you are
interested in Compose, image-heavy interfaces, downloads, backups, or local data.
Do not follow old advice that sends you to Tachiyomi as if the original project
were still active.

### NewPipe

[NewPipe's contribution
guide](https://github.com/TeamNewPipe/NewPipe/blob/dev/.github/CONTRIBUTING.md)
covers setup, issue reporting, translation, and code changes. The project is in a
significant refactor, so confirm which branch accepts the kind of change you want
to make. A bug fix for maintained code and a feature for the refactor may follow
different paths.

### Signal Android

[Signal Android](https://github.com/signalapp/Signal-Android) recommends that new
contributors begin with a simple existing bug and asks people to discuss larger
features first. It is a complex, security-sensitive app. That can make a small,
well-scoped fix valuable, but it is not the easiest repository for learning basic
Android architecture from scratch.

### Official Android samples

[Now in Android](https://github.com/android/nowinandroid) and the [Compose
samples](https://github.com/android/compose-samples) accept pull requests, but
their open issue lists can be small and tightly curated. They are excellent to
read. Treat a contribution opportunity as a bonus, not a promise that there will
always be a beginner task waiting.

## A first contribution does not need to be Kotlin

Useful work can include:

- Reproducing a bug and improving the report with exact steps and logs.
- Fixing an inaccurate setup instruction.
- Adding a regression test for a confirmed bug.
- Improving accessibility labels or keyboard behaviour.
- Updating translations through the project's chosen platform.
- Testing a pending pull request and reporting what happened.

Do not submit cosmetic churn just to create activity. Renaming files, reformatting
unrelated code, or generating documentation nobody requested creates review work
without solving a problem.

## Before you write code

Build the project unchanged and run the relevant tests. If that fails, stop and
work out whether your environment or the documentation is wrong. A pull request
is much harder to trust when the contributor never ran the original app.

For anything larger than an obvious typo or one-line fix, comment on the issue:

> I reproduced this on version X. I think the failure happens in Y because Z. I
> would like to add a regression test and change only this path. Does that scope
> fit the project?

That message is useful because it contains evidence and a plan. "Can I work on
this?" gives a maintainer very little to respond to.

## Make the pull request easy to review

A solid description covers four things:

1. The behaviour before the change.
2. The behaviour after the change.
3. Why this approach fits the existing code.
4. How you tested it, including device or emulator details when relevant.

Attach screenshots or a short recording for UI changes. Keep unrelated cleanup
out of the patch. If review feedback arrives, respond to the point rather than
defending the first version out of pride.

Then wait. A week without review is normal in many volunteer projects. Follow the
project's etiquette before nudging, and be willing to close the work if the
project has moved in another direction.

One careful contribution teaches more than five speculative pull requests. The
skill you are building is not merely writing code. It is joining an existing
conversation without making everybody else's job harder.

