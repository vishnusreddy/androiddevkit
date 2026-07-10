---
title: The mobile system design interview
description: Turn an ambiguous feature into requirements, state ownership, APIs, storage, synchronization, failure handling, security, and measurable tradeoffs.
level: senior
order: 6
duration: 95 min
quizHref: /practice/?test=system-design-test
quizLabel: Take the system design quiz
---

A strong mobile system design answer is not a diagram with repository boxes. It is a sequence of decisions tied to user behavior and failure conditions. The interviewer should hear what the product guarantees, where truth lives, how the client recovers, and what you would measure after release.

## Learning goals

- Drive a system design interview from requirements to tradeoffs.
- Estimate the constraints that materially affect a mobile design.
- Define client state, server APIs, local schema, sync, and conflict policy.
- Cover security, performance, testing, rollout, and observability.
- Adapt the framework to chat, feed, media, checkout, maps, and collaboration.

## The 45-minute structure

![Mobile system design interview flow](/diagrams/mobile-system-design-interview.svg)

A practical allocation is:

1. **Clarify product and constraints:** 5 to 8 minutes.
2. **Define state and high-level data flow:** 5 minutes.
3. **Deep dive into the riskiest path:** 15 to 20 minutes.
4. **Failure, security, performance, and scale:** 8 to 10 minutes.
5. **Testing, rollout, and tradeoff summary:** remaining time.

Do not rigidly recite a template. Spend depth on the part that makes the feature hard.

## Step 1: clarify the product

Ask questions that change architecture:

- What is the primary user journey?
- Must it work offline, read-only offline, or fully editable offline?
- Is ordering server-authoritative?
- Are writes acknowledged immediately or eventually?
- Which data is sensitive?
- How fresh must data be?
- Which Android versions and form factors matter?
- Are push, camera, location, media, or background execution involved?
- What scale matters: records per user, payload size, concurrent actions, or daily active users?

Then state a scoped version:

> I will design the Android client for a chat conversation list and message screen. It will show cached history offline, queue text messages while disconnected, support push-triggered refresh, and use the server as authority for delivery and read status. I will leave voice calls out of scope.

That statement prevents the answer from expanding without control.

## Step 2: define the guarantee vocabulary

Use precise states:

- **Local intent:** user asked to perform an operation.
- **Queued:** operation is durably stored on device.
- **Sent:** request bytes were attempted, but outcome may still be unknown.
- **Acknowledged:** server accepted the operation and returned durable identity or version.
- **Delivered:** recipient device or service acknowledged delivery, if the product supports it.
- **Read:** recipient explicitly or implicitly acknowledged consumption according to product rules.

Do not call a locally queued message "delivered."

## Step 3: draw the data flow

A robust default for offline-capable features is:

```text
Compose / Views
    observes
ViewModel UI state
    observes
Repository
    observes and writes
Room local source of truth
    synchronized by
API + WorkManager / app-scoped sync
```

Add external systems only when relevant: object storage and CDN for media, WebSocket for live events, push service for wakeup hints, map SDK for tiles, or payment SDK for regulated entry.

## Step 4: define local state and schema

Schema should reveal invariants. For chat:

```text
conversations(
  id, title, last_server_sequence, last_read_sequence, updated_at
)

messages(
  local_id, server_id?, conversation_id, sender_id,
  client_operation_id, server_sequence?, body, created_at_client,
  created_at_server?, send_state, failure_code?
)

attachments(
  id, message_local_id, local_uri?, remote_url?, upload_state, bytes_total
)
```

Important choices:

- `local_id` renders a pending message before server acknowledgement.
- `client_operation_id` deduplicates retries.
- `server_sequence` provides authoritative conversation order.
- `send_state` distinguishes queued, sending, acknowledged, and failed.
- Local URI is not assumed to remain readable forever without a persisted grant or app-owned copy.

Describe indexes that match queries, such as `(conversation_id, server_sequence)` and unique operation ID.

## Step 5: define API contracts

Name requests, responses, pagination, and idempotence:

```http
POST /v1/conversations/{id}/messages
Idempotency-Key: 7fc2...

{
  "clientOperationId": "7fc2...",
  "body": "hello"
}
```

```json
{
  "messageId": "m_1042",
  "conversationId": "c_12",
  "serverSequence": 9081,
  "acceptedAt": "2026-07-10T09:30:00Z"
}
```

For reads, prefer opaque cursors when ordered data changes frequently:

```http
GET /v1/conversations/c_12/messages?before=opaqueCursor&limit=50
```

State authentication, authorization, rate limiting, cache validation, and versioning behavior where they matter.

## Step 6: walk one write end to end

For send message:

1. Validate length and attachment constraints locally.
2. Generate local ID and operation ID.
3. Insert queued message in Room transaction.
4. UI observes and renders it immediately as queued.
5. Start sync while app is active; schedule persistent work if it must survive exit.
6. Send request with idempotency key.
7. On acknowledgement, transactionally attach server ID, sequence, time, and acknowledged state.
8. On timeout, keep outcome unknown and query or safely retry with the same key.
9. On permanent rejection, mark failed with an actionable reason.

This walk-through proves the architecture handles process death between any two steps.

## Step 7: live updates and push

Choose based on requirements:

- **WebSocket:** low-latency bidirectional events while connected.
- **Server-sent events:** server-to-client stream where supported by stack.
- **Push:** power-efficient wakeup hint, not guaranteed complete event log.
- **Polling:** simple, useful for low-frequency or fallback reconciliation.

For correctness, events should carry stable IDs or sequence numbers. After reconnect:

1. Send last known server cursor or sequence.
2. Fetch the missing range.
3. Upsert by stable identity.
4. Detect a gap and perform bounded reconciliation.

Push payloads should be minimal and non-sensitive. Fetch authoritative content after receipt when needed.

## Step 8: conflict policy

Name the unit of conflict and authority:

- Last-write-wins can be acceptable for a low-value preference when server time or version is authoritative.
- Field-level merge can preserve independent edits.
- Server rejection may be correct for inventory or payment state.
- Operational transform or CRDT may be justified for concurrent collaborative editing, but adds substantial protocol and storage complexity.

For each policy, state what the user sees. "We use CRDT" without product behavior is not a complete answer.

## Step 9: media and large payloads

Do not proxy large media through the same JSON endpoint without considering cost and reliability.

A common flow:

1. App asks server for an upload session or signed URL.
2. App uploads directly to object storage in chunks if needed.
3. App reports the completed object key to the server.
4. Server validates ownership, size, type, and scanning status.
5. CDN serves derived, access-controlled variants.

On device:

- Copy or persist access to the selected source.
- Store durable upload progress.
- Resume with server-issued upload identity.
- Bound parallelism and respect metered networks.
- Generate thumbnails without decoding full-resolution media unnecessarily.

## Step 10: capacity estimates that matter

Mobile interviews rarely need data-center math for its own sake. Estimate when it changes the client:

- 100 messages per day at 1 KB each is tiny locally, but media dominates storage.
- A 20 MB video on cellular requires resumable transfer and user feedback.
- 50,000 cached rows require indexed pagination, not loading all into memory.
- Millions of users make synchronized periodic polling expensive for server and battery.
- A 1 percent crash rate in checkout is catastrophic even if average latency is good.

State assumptions and calculate an order of magnitude. Do not invent precise numbers without evidence.

## Step 11: failure matrix

| Failure | Durable truth | User experience | Recovery |
|---|---|---|---|
| Offline before send | Queued local operation | Pending indicator | Constraint-aware retry |
| Timeout after send | Outcome unknown | Still pending, no duplicate | Same idempotency key and reconciliation |
| 401 | Credential invalid or expired | Brief auth recovery | Serialized refresh or sign-in |
| 409 conflict | Server rejected version | Explain changed state | Merge, reload, or user decision |
| Process death | Room and work spec remain | Restore from disk | Resume pending work |
| Push dropped | Server remains authoritative | Data may be temporarily stale | Reconcile on open or reconnect |
| Database migration failure | Local store unavailable | Safe error or controlled reset by policy | Tested migration, backup or refetch plan |

An interview answer becomes senior when failure behavior is as concrete as happy-path behavior.

## Step 12: security and privacy

Cover the feature-specific risks:

- Server authorization for every conversation or resource.
- Short-lived credentials and safe refresh.
- No sensitive message body in push, logs, or analytics.
- Encrypted transport and threat-model appropriate local protection.
- Exported deep-link validation.
- Abuse limits, spam controls, and attachment validation.
- Account deletion and local data clearing.

Avoid claiming end-to-end encryption unless the protocol, key distribution, multi-device behavior, backup, and metadata leakage are in scope.

## Step 13: testing strategy

- Pure state-machine tests for operation transitions.
- Repository tests with fake API and real/in-memory database.
- Migration tests across supported schema versions.
- Contract tests for API request and response compatibility.
- Worker tests for duplicate execution and interruption.
- UI tests for queued, stale, failed, and conflict states.
- Performance tests for startup, large list, and media paths.
- Chaos scenarios: timeouts, reordered events, duplicate events, expired token, full disk.

## Step 14: observability and rollout

Define outcome metrics:

- Send acknowledgement latency p50, p95, p99.
- Pending operations older than a threshold.
- Retry attempts per acknowledged operation.
- Duplicate rejection or conflict rate.
- Reconnect gap recovery success.
- Crash and ANR rate by release and device tier.

Roll out schema, API, and client changes compatibly:

1. Server accepts old and new forms.
2. Client dual-reads or dual-writes only when necessary.
3. Release behind a kill switch or staged percentage.
4. Observe success and guardrail metrics.
5. Migrate or backfill.
6. Remove old behavior only after adoption is safe.

## Adapting the framework

### Feed

Deep dive on ranking cursor, cache freshness, media prefetch, paging, and read state. Explain that client cannot reproduce a server ranking model from page number alone.

### Checkout

Deep dive on idempotent order submission, server-priced totals, inventory conflict, payment SDK boundary, unknown outcomes, and receipt reconciliation.

### Music or video

Deep dive on manifest/segment delivery, DRM, buffering, adaptive bitrate, download licenses, audio focus, media session, and storage quotas.

### Maps or ride tracking

Deep dive on permission states, foreground service rules, sampling, map matching, battery, stale position, and privacy retention.

### Collaborative document

Deep dive on operation log, versions, conflict algorithm, presence, reconnect gaps, compaction, and large-document performance.

## Common pitfalls

1. Drawing architecture before clarifying offline and consistency requirements.
2. Saying "MVVM plus repository" as the whole design.
3. Treating push as guaranteed event delivery.
4. Marking a local write successful before server acknowledgement.
5. Retrying POST without idempotency.
6. Using device time as global ordering authority.
7. Naming CRDT without explaining operations and user behavior.
8. Ignoring rollout compatibility between old clients and new APIs.
9. Ending without tradeoffs or metrics.

## How interviewers probe this

- "Design WhatsApp messages on Android."
- "Design an offline-first notes app."
- "Design Instagram feed pagination."
- "Design checkout under unreliable networks."
- "How do you avoid duplicate writes?"
- "What happens after process death at each step?"
- "How do you roll out a schema change?"
- "What would you measure in production?"

## Practice checklist

1. Deliver a 30-minute chat design using this structure and record yourself.
2. Redesign the same feature with read-only offline vs editable offline.
3. Write the local schema and two API contracts for checkout.
4. Produce a failure matrix for media upload.
5. Add an old-client compatibility plan to a server response change.
6. End every practice answer with three explicit tradeoffs and three metrics.

## What you should be able to explain

- A complete mobile design from product guarantee to rollout.
- Local state, server authority, synchronization, and unknown outcomes.
- The hardest path in chat, feed, checkout, media, maps, or collaboration.
- Failure recovery, security, testing, and measurable success.

Next: **senior interview execution and leadership signals**, where technical judgment must become a clear story of decisions and impact.
