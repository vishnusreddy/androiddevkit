---
question: "REST vs GraphQL for a mobile client, and what API design choices matter for mobile?"
topic: system-design
difficulty: senior
order: 10
starred: false
section: "Client foundations"
tags: ["system-design", "api-design", "graphql", "rest"]
---

**REST** - resource-oriented endpoints (`GET /users/1`, `GET /users/1/posts`).
- **Advantages:** simple, familiar, compatible with HTTP caching and ETags, and
  supported by mature tooling such as Retrofit.
- **Costs:** an endpoint can over-fetch fields or require several round trips to
  assemble one screen.

**GraphQL** - a single endpoint; the client **queries exactly the fields it needs** in one request.
- **Advantages:** the client selects the fields it needs, generated models can be
  strongly typed, and one query can assemble data for a screen.
- **Costs:** ordinary HTTP caching is harder, normalized client caching is more
  complex, and the server must control query cost and abuse.

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
