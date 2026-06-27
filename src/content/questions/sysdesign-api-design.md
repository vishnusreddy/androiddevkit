---
question: "REST vs GraphQL for a mobile client, and what API design choices matter for mobile?"
topic: system-design
difficulty: senior
tags: ["system-design", "api-design", "graphql", "rest"]
---

**REST** - resource-oriented endpoints (`GET /users/1`, `GET /users/1/posts`).
- ✅ Simple, cacheable (HTTP caching/ETags), familiar, great tooling (Retrofit).
- ❌ **Over-fetching** (endpoint returns more than the screen needs) and **under-fetching** (N+1 round trips to assemble a screen - fetch user, then posts, then comments).

**GraphQL** - a single endpoint; the client **queries exactly the fields it needs** in one request.
- ✅ **No over/under-fetching** - one round trip builds a whole screen; the client controls the shape; strongly typed (Apollo codegen).
- ✅ Great when **different screens need different slices** of the same data and you want to minimize round trips on mobile networks.
- ❌ HTTP caching is harder (usually POST to one URL - needs client-side normalized cache like Apollo's), more server complexity, query cost/abuse concerns.

**For mobile specifically**, the deciding factors:
- **Round trips are expensive** on high-latency mobile networks → GraphQL's "one query per screen" is attractive; with REST, design **screen-shaped/aggregated endpoints** (BFF - Backend-for-Frontend) to avoid N+1.
- **Payload size** matters (data cost) → fetch only needed fields (GraphQL, or REST `?fields=`).

**API design choices that matter for mobile regardless of REST/GraphQL:**
- **Cursor-based pagination** (stable under live updates).
- **Partial responses / field selection** to cut payload.
- **Compression** (gzip/brotli), and efficient formats (protobuf for high-volume).
- **ETags/conditional requests** to save bandwidth.
- **Backward compatibility / versioning** - old app versions live for months; don't break them. Additive changes, version the API.
- **Batch endpoints** and a **BFF** to shape responses for the client.
- **Idempotency keys** for safe retries of writes.
- **Clear error contracts** (codes the client can act on).
