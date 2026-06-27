---
question: "Compare pagination strategies for a mobile client. Why cursor over offset?"
topic: system-design
difficulty: mid
tags: ["system-design", "pagination", "api-design"]
---

Pagination loads a large list in chunks. The main strategies:

**Offset/limit (page-based)** - `?offset=40&limit=20` (or `?page=3`).
- ✅ Simple, can jump to arbitrary pages, shows total count.
- ❌ **Breaks on inserts/deletes** - if items are added at the top while you scroll, offset 40 now points at a shifted position → **duplicates or skipped items**.
- ❌ Slow on large datasets (DB `OFFSET` scans rows).

**Cursor/keyset-based** - `?after=<cursor>&limit=20`, where the cursor encodes the last item's stable position (e.g. `createdAt` + `id`).
- ✅ **Stable under inserts/deletes** - you ask for "items after *this specific item*," so shifting doesn't cause dupes/gaps.
- ✅ Efficient (`WHERE id < cursor LIMIT n` uses an index, no offset scan).
- ❌ No random page access, harder to show a total count or "page 5."

**Why cursor wins for feeds:** social/chat/activity feeds change constantly at the head. Cursor pagination is the standard because it's **consistent during live updates** - exactly the mobile reality.

**Mobile client implementation (Paging 3):**
- **`PagingSource`** loads pages by cursor; **`RemoteMediator`** writes pages into **Room** for offline-first paging.
- **Prefetch distance** - load the next page *before* the user hits the end (smooth scroll).
- **Placeholders** for not-yet-loaded items; **dedup** by stable id; expose **load states** (loading/error/retry).
- `cachedIn(scope)` to survive config changes.

**Other approaches:** **keyset with timestamp** for chat history (`before=<seq>`), **bidirectional** paging (load older *and* newer), and **infinite scroll vs explicit "load more"** as UX choices.

**Trade-offs to name:** cursor's consistency vs loss of random-access/total-count; prefetch distance (smoothness vs memory/data); page size (fewer requests vs larger payloads).
