---
question: "Design an offline-first notes app with sync across devices."
topic: system-design
difficulty: senior
tags: ["system-design", "offline", "sync", "conflict-resolution"]
---

This problem is really about **sync and conflict resolution** - the interviewer will push hard there.

**Requirements:** create/edit/delete notes offline, sync across devices, handle conflicts (edited on two devices), eventual consistency.

**Local model (source of truth = local DB):**
```
notes(id, content, updatedAt, version, syncStatus, isDeleted)
syncStatus: SYNCED | PENDING | CONFLICT
```
- **Client-generated IDs (UUIDs)** so notes can be created offline without a server round-trip.
- **Soft delete** (`isDeleted`) so deletions propagate (you can't sync the *absence* of a row reliably).

**Sync engine:**
- **Delta sync** - the client stores a **sync token / last-sync timestamp**; it pulls only changes since then and pushes its local `PENDING` changes. Avoids re-downloading everything.
- Triggered on app open, on a timer, on connectivity regained (**WorkManager** with a network constraint), and optionally on a push ("you have changes").
- **Optimistic UI** - edits apply locally immediately (`PENDING`), sync in the background.

**Conflict resolution (the heart of it):**
- **Last-Write-Wins (LWW)** - simplest: compare `updatedAt`/version, newest wins. Risks silent data loss.
- **Version vectors / `version` counter** - detect that both sides changed since the common ancestor → a real conflict.
- **Field-level / 3-way merge** - merge non-overlapping changes; only truly conflicting fields need resolution.
- **CRDTs** - for collaborative/concurrent editing (e.g. text), conflict-free automatic merging - mention for real-time collab, but it's heavier.
- **User-prompted** - surface "keep both / pick one" when automatic merge is unsafe.

State your choice and *why*: "For simple notes, LWW with a version check and a 'conflict copy' fallback; for collaborative editing, CRDTs."

**Other concerns:** **idempotent** sync (replaying a push is safe), **tombstones** with cleanup, **partial sync failure** handling (per-note status), and **encryption at rest** if sensitive.

**Trade-offs to name:** LWW simplicity vs data-loss risk; delta sync efficiency vs complexity; how aggressively to sync (battery/data) vs freshness.
