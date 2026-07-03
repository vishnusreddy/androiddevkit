---
question: "How do you approach a mobile system design interview?"
topic: system-design
difficulty: mid
order: 10
starred: true
section: "Interview framework"
tags: ["system-design", "framework", "interview"]
---

Drive the conversation with a structured framework—interviewers grade your
**process and trade-off reasoning**, not a memorized answer. Keep the design
client-focused, but define the minimum server contracts the client depends on:
pagination, synchronization, idempotency, authentication, and real-time
delivery semantics.

**A repeatable structure (~45 min):**

**1. Clarify requirements (5 min).** Don't jump in. Pin down:
- **Functional** - what features? (feed: scroll, like, post? offline?)
- **Non-functional** - offline support, real-time, scale, target devices/OS versions, battery/data constraints.
- **Scope** - "Should I focus on the feed rendering and data layer?" Narrow it.

**2. Define the API / data contract (5 min).** The endpoints the client calls, request/response shapes, pagination style (cursor), and real-time mechanism (WebSocket/FCM/poll). This frames everything downstream.

**3. High-level architecture (10 min).** Layered client design:
- UI (Compose/Views + ViewModel/UDF)
- Domain (use cases, if needed)
- Data (repository, **single source of truth**, local DB + network + cache)
- Draw the data flow: **UI ↔ ViewModel ↔ Repository ↔ {Room, Network}**.

**4. Deep-dive the highest-risk parts (15 min).** Choose the decisions that
dominate the design and examine them closely:
- **Caching & offline** - DB as source of truth, freshness policy.
- **Pagination** - cursor-based, prefetch.
- **Sync & conflicts** - optimistic updates, reconciliation.
- **Images/media** - downsampling, prefetch, cancellation.
- **Real-time** - WebSocket vs FCM vs polling.

**5. Trade-offs and wrap-up (5 to 10 min).** Name the tensions explicitly: memory vs smoothness, freshness vs data usage, consistency vs latency, battery vs real-time behavior. Mention failure modes, error handling, and what you would measure.

**Cross-cutting concerns to weave in:** offline behavior, error/retry, security (token storage), performance (jank, startup), battery/data, testing, observability.

**What separates a strong candidate:** **naming the trade-off out loud** ("longer cache TTL saves data but risks staleness - I'd…"), handling **failure cases**, and connecting choices to **constraints** (flaky network, limited battery).
