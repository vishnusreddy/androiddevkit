---
question: "How do you design the local database schema for a mobile client?"
topic: system-design
difficulty: mid
tags: ["system-design", "database", "room", "schema"]
---

The local DB (Room) is usually the **single source of truth**, so the schema should serve **offline reads, sync, and fast queries** - not mirror the backend blindly.

**Principles:**
- **Model for your screens' queries**, not the API shape. Denormalize where it makes reads fast; normalize where data is shared/updated independently.
- **Stable primary keys** - use **server IDs** when available, or **client-generated UUIDs** for offline-created entities (so they exist before sync).
- **Sync metadata on each table** - fields like `updatedAt`, `syncStatus (SYNCED/PENDING/CONFLICT)`, `isDeleted` (soft delete / tombstone), `version`. These power delta sync and conflict detection.
- **Relations** - `@Relation`/foreign keys for one-to-many (a chat → messages); index foreign keys and common query columns.
- **Indexing** - add indices on columns you filter/sort by (`chatId`, `createdAt`); don't over-index (write cost).

**Example (chat):**
```
chats(id PK, title, lastMessageAt, unreadCount)
messages(id PK, chatId FK→chats, body, status, serverSeq, createdAt, syncStatus)
  index(chatId, serverSeq)        -- ordered history queries
```

**Key decisions interviewers probe:**
- **Soft delete vs hard delete** - soft (`isDeleted`) so deletions can sync; clean up tombstones later.
- **Migrations** - version the schema; provide `Migration` objects (never ship destructive migration to prod).
- **Normalization vs denormalization** - denormalize a `lastMessage` onto `chats` for a fast list query vs joining every time (read speed vs write/consistency cost).
- **Large blobs** - store **files on disk**, keep a **path/URI** in the DB (don't put images/videos in SQLite).
- **Pagination** - keyset-friendly columns (`serverSeq`/`createdAt`) for cursor paging; works with Paging 3 `PagingSource`.
- **Observability** - `Flow`-returning queries so the UI updates reactively.

**Performance:** wrap bulk writes in transactions, use `@Upsert`, avoid main-thread queries (Room enforces this), and FTS tables for search.

**Trade-offs to name:** denormalization (read speed vs update complexity/consistency), indexing (read speed vs write cost & size), soft delete (sync correctness vs cleanup), storing derived fields (fast reads vs keeping them in sync).
