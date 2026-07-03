---
question: "Compare pagination strategies for a mobile client. Why cursor over offset?"
topic: system-design
difficulty: mid
order: 50
starred: true
section: "Client foundations"
tags: ["system-design", "pagination", "api-design"]
---

Pagination loads a large list in chunks. The main strategies:

**Offset/limit (page-based)** - `?offset=40&limit=20` (or `?page=3`).
- **Advantages:** simple, supports arbitrary page access, and can show a total count.
- **Costs:** inserts and deletes can shift an offset and cause duplicates or
  skipped items. Large database offsets may also require scanning many rows.

**Cursor/keyset-based** - `?after=<cursor>&limit=20`, where the cursor encodes the last item's stable position (e.g. `createdAt` + `id`).
- **Advantages:** stable under inserts and deletes when the cursor represents a
  deterministic sort position, and efficient with a matching index.
- **Costs:** no arbitrary page access, and total count or "page 5" is harder to
  expose.

**Why cursor wins for feeds:** social/chat/activity feeds change constantly at the head. Cursor pagination is the standard because it's **consistent during live updates** - exactly the mobile reality.

**Mobile client implementation (Paging 3):**
- **`PagingSource`** loads pages by cursor; **`RemoteMediator`** writes pages into **Room** for offline-first paging.
- **Prefetch distance** - load the next page *before* the user hits the end (smooth scroll).
- **Placeholders** for not-yet-loaded items; **dedup** by stable id; expose **load states** (loading/error/retry).
- `cachedIn(scope)` to survive config changes.

**Other approaches:** **keyset with timestamp** for chat history (`before=<seq>`), **bidirectional** paging (load older *and* newer), and **infinite scroll vs explicit "load more"** as UX choices.

**Trade-offs to name:** cursor's consistency vs loss of random-access/total-count; prefetch distance (smoothness vs memory/data); page size (fewer requests vs larger payloads).
