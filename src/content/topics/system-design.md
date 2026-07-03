---
title: Mobile System Design
description: Designing offline-first apps, caching, pagination, image loading, and client-side architecture at scale.
category: Engineering
order: 40
icon: "◈"
---

Mobile system design interviews test whether you can turn product requirements
into a reliable client under real device constraints. The prompt may be a feed,
chat app, sync engine, analytics library, or reusable SDK. Interviewers care
about data flow, failure recovery, operability, and trade-offs. A large backend
diagram is not a substitute for a coherent client design.

### A simple study path

Start with the starred interview framework and client-foundation questions.
Pick one familiar app and describe its user flow, data model, API contract,
local source of truth, loading states, and failure states. Then add offline
support, pagination, sync, security, observability, and testing. Practise one
product design and one SDK or library design because the constraints differ.

### The client concerns you should always check

- **Requirements and scale**: critical flows, data volume, freshness, supported devices, and accessibility.
- **State and storage**: source of truth, schema, cache policy, offline behavior, and process death.
- **Network and sync**: API contract, pagination, idempotency, retries, conflicts, and real-time delivery.
- **Resources**: memory, disk, battery, bandwidth, startup, and rendering performance.
- **Trust**: authentication, privacy, secure storage, abuse resistance, and data deletion.
- **Operations**: metrics, logs, rollout, migrations, backward compatibility, and tests.

### How interviewers push the design

After the first diagram, expect constraints such as "the network disappears",
"two devices edit the same item", "the process dies", "the SDK must not slow
startup", or "the server accepted the request but the response was lost". Keep
important state durable, make retries safe, and say what the user sees during
uncertainty.

The stars mark the questions worth covering first. Product case studies are
practice arenas, not scripts to memorize.

### Useful references

- [Guide to app architecture](https://developer.android.com/topic/architecture)
- [Offline-first data layer](https://developer.android.com/topic/architecture/data-layer/offline-first)
- [Background work](https://developer.android.com/develop/background-work/background-tasks)
- [App quality guidance](https://developer.android.com/quality)
