---
title: Reliability, observability, and technical decisions
description: Connect architecture choices to rollout safety, production signals, and an explicit decision record.
level: senior
order: 3
duration: 55 min
quizHref: /practice/?test=senior-full-mock
quizLabel: Take the senior full mock
---

Senior engineering is not only selecting a pattern. It is making a choice the team can **ship safely**, **observe in production**, and **revisit when evidence changes**. Interviews for senior Android roles increasingly probe judgment: rollouts, migrations, incidents, and trade-offs under incomplete information.

## Learning goals

- Instrument outcomes that answer product and reliability questions.
- Plan rollouts with flags, staged delivery, and kill switches.
- Write decision records that capture context, options, and consequences.
- Reason about failure modes end-to-end (client, network, backend, store).
- Communicate trade-offs without false certainty.

## Instrument outcomes, not private data

Client telemetry should answer useful questions:

- Did refresh succeed?
- How long did it take?
- Which app version and OS saw the failure?
- Is the failure a timeout, auth error, parse error, or local storage error?

```kotlin
analytics.track(
    name = "article_refresh",
    properties = mapOf(
        "outcome" to "timeout",
        "duration_ms" to elapsedMs,
        "http_code" to (code ?: -1),
        "app_version" to BuildConfig.VERSION_NAME,
    ),
)
```

Do **not** collect raw message bodies, tokens, email contents, or personal notes “just in case.” Privacy constraints and trust are part of reliability.

![Reliable mobile analytics delivery pipeline](/diagrams/analytics-pipeline.svg)

### Define owners and thresholds

A metric without an owner and a threshold is decoration.

| Signal | Threshold example | Owner response |
|--------|-------------------|----------------|
| Crash-free sessions | < 99.5% on latest release | Rollback / hotfix |
| Sync success rate | < 98% for 15 min | Page on-call mobile |
| Outbox p95 age | > 30 min | Inspect worker/API |
| Cold start p95 | Regression > 20% | Block rollout |

Use Play Vitals, Firebase Crashlytics, custom analytics, and backend SLOs together - client-only or server-only views lie.

## Failure modes worth naming

Senior answers inventory failures before solutions:

1. **Network** - loss, latency, captive portals, partial responses.
2. **Auth** - expired tokens, clock skew, revoked sessions.
3. **Client storage** - full disk, corrupted DB, migration failure.
4. **Compatibility** - old app vs new API, feature flags off.
5. **Concurrency** - double submit, multi-tab/device races.
6. **Store ecosystem** - staged rollout, device fragmentation, OEM background kills.
7. **Human** - bad release, misconfigured remote config, missing migration.

For each critical user journey, ask: *what does the user see, what is persisted, what can we retry, what must we alert on?*

## Rollouts and kill switches

### Feature flags

```kotlin
if (flags.isEnabled(Flag.NEW_CHECKOUT)) {
    NewCheckoutRoute()
} else {
    LegacyCheckoutRoute()
}
```

Flags enable:

- Gradual exposure (1% → 10% → 100%)
- Instant disable without waiting for store review (for remote flags)
- Experimentation with clear metrics

Risks: flag debt, untested combinations, “forever flags.” Budget cleanup.

### Android release mechanics

- **Staged rollouts** in Play Console
- **Remote Config / flag systems** for behavior
- **Compatible server APIs** (additive changes; deprecation windows)
- **DB migrations** tested on upgrade paths, not only fresh installs

Never ship a non-backward-compatible schema without a migration plan and crash plan.

## Technical decision records (ADRs)

When you choose Room+outbox over “server only,” or Hilt over Koin, or single-Activity Compose, write down:

1. **Context** - forces, constraints, timeline
2. **Options** considered (at least two real ones)
3. **Decision**
4. **Consequences** - positive and negative
5. **Validation** - how we will know it worked
6. **Revisit triggers** - metrics or dates

```markdown
# ADR-017: Offline notes via outbox

## Context
Users edit on flights; support tickets show lost notes after process death.

## Options
A) Memory-only optimistic UI
B) Room + outbox + WorkManager
C) Full CRDT collaborative sync

## Decision
B for v1.

## Consequences
+ Airplane mode works; durable pending state
- Conflict policy LWW may overwrite rare multi-device edits
- Need ops metrics for outbox age

## Revisit
If multi-device conflict tickets exceed N/month, evaluate field merge/CRDT.
```

Interviewers love hearing that you **document and revisit** - not that you “always pick the best architecture.”

## Migrations as first-class work

Examples:

- XML → Compose screen-by-screen with interop
- Monolith → feature modules leaf-first
- LiveData → StateFlow
- Callback network → coroutines
- SharedPreferences → DataStore
- Sync v1 → sync v2 protocol with dual-read/dual-write windows

Dual-running, adapter layers, and feature flags beat big-bang rewrites for production apps.

## Performance and reliability together

A feature that is correct but ANRs under load is unreliable. Connect:

- Main-thread budgets
- Bounded queues (outbox size, channel buffers)
- Backpressure (paging, not unbounded `List` in memory)
- Timeouts and cancellation
- Degradation modes (“show cache,” “read-only,” “queue for later”)

```kotlin
withTimeout(15_000) {
    api.sync(payload)
}
```

Degraded UX is often better than infinite spinner.

## Security judgment (senior-level, practical)

- Least privilege permissions; explain why each permission exists
- Certificate pinning trade-offs (ops cost vs MITM risk)
- WebView hardening if used
- Export status of components (`android:exported`)
- Backup rules for sensitive data
- Logging redaction

You need a threat model proportional to the product (fintech ≠ flashlight).

## Communicating in senior interviews

Structure:

1. Restate goals and non-goals
2. Constraints (team size, latency, offline, compliance)
3. Options with trade-offs
4. Recommendation with rollback plan
5. Metrics for success
6. Open questions / assumptions

Speak in **failures and users**, not only library names.

## Common pitfalls

1. Choosing tech for resume-driven development.
2. No kill switch on risky launches.
3. Metrics that cannot detect the failure mode you fear.
4. Migrations without upgrade testing.
5. Overconfidence: “that can’t happen” without proof.

## How interviewers probe this

- “Tell me about a technical decision you made and how you validated it.”
- “How do you roll out a risky change?”
- “What do you monitor after release?”
- “Describe an incident and your follow-up.”
- “How do you handle an API breaking change?”
- “Compose migration plan for a large app?”

## Practice checklist

1. Write a one-page ADR for a real or sample decision.
2. List metrics for a sync feature and fake an on-call playbook.
3. Draft a staged rollout plan for a payment UI rewrite.
4. Practice a 3-minute story: problem → options → decision → result → lesson.

## What you should be able to explain

- Outcome-oriented telemetry with privacy boundaries.
- Flags, staged rollout, and rollback.
- ADRs and revisit criteria.
- Failure-mode-first design.
- Migration strategies that respect production users.

Next: **platform internals and performance engineering**, where production signals are connected to process startup, rendering, Binder, ART, memory, and ANR evidence.
