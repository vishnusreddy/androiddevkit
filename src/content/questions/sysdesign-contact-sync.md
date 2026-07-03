---
question: "Design contact synchronization between an Android device and a backend."
topic: system-design
difficulty: senior
order: 55
starred: true
section: "Sync and real-time"
tags: ["system-design", "sync", "contacts", "privacy", "workmanager"]
---

Start by clarifying whether the product uploads an address book for discovery,
maintains a cloud backup, or performs two-way editing. Those are different
privacy and conflict-resolution problems.

**Permission and privacy:** request contacts permission only at the moment the
user enables the feature, explain the purpose, and provide a useful denied state.
Collect only required fields. For contact discovery, prefer normalized and
salted identifiers with a protocol designed with the backend security team, not
raw address-book uploads by default. Support opt-out and deletion.

**Local snapshot:** read through `ContentResolver` off the main thread. Normalize
phone numbers with country context, canonicalize email addresses carefully, and
create a stable local fingerprint from relevant fields. Persist a mapping such
as:

```text
localContactKey, serverId, fingerprint, serverVersion, syncState, deletedAt
```

Do not assume the Contacts provider row ID is permanent across restore, merge,
or account changes.

**Delta sync:** compare the current snapshot with the last successful snapshot.
Upload creates, updates, and tombstones in bounded batches. Pull server changes
using an opaque sync token. Commit the new token only after the whole page or
transaction is durably applied.

**Reliability:** give every mutation an idempotency key. Persist an outbox before
upload, retry transient failures with backoff, and let WorkManager resume durable
sync under appropriate network and battery constraints. Handle partial batch
success per item instead of restarting everything.

**Conflicts:** define field ownership. Device-authoritative discovery may simply
replace the server snapshot. Two-way editing needs versions and a merge policy,
such as field-level merge with an explicit conflict for simultaneous edits.
Propagate deletions through tombstones so an offline device does not resurrect a
deleted contact.

**Scale and UX:** stream provider reads, cap memory, debounce rapid provider
changes, show last-sync status, and never block the contacts UI. Measure sync
latency, queue depth, failure reason, bytes, and battery without logging contact
data.

Important failure cases are permission revocation, account switch, restore onto
a second device, duplicate contacts, locale changes, process death, and a lost
response after the server accepted a batch.
