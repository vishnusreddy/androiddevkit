---
question: "In Clean Architecture, where should a repository interface live?"
topic: architecture
difficulty: mid
order: 34
starred: true
section: "Architecture foundations"
tags: ["clean-architecture", "repository", "dependency-inversion", "modules"]
---

Place an abstraction with the policy that owns the contract, not automatically
next to its implementation.

In strict Clean Architecture, a domain or application module defines the port it
needs:

```kotlin
// :domain
interface Orders {
    fun observeOrder(id: OrderId): Flow<Order>
    suspend fun submit(command: SubmitOrder): OrderId
}

// :data
class OfflineFirstOrders(
    private val api: OrdersApi,
    private val dao: OrdersDao,
) : Orders {
    // Network and Room details stay outside the domain contract.
}
```

The data module depends on the domain contract and implements it. The use case
depends only on `Orders`. Hilt or a manual composition root binds
`OfflineFirstOrders` to that contract.

This inversion is useful when:

- Domain rules must compile without data frameworks.
- Multiple implementations exist or are expected.
- The contract is shared across entry points or platforms.
- A module boundary must prevent data-source types from leaking inward.

It can be unnecessary when the repository itself is already the stable public
API of a small data layer and no independent domain module exists. In Google's
recommended architecture, UI or use cases can depend on a repository class from
the data layer. That is still a valid layered design.

Do not shape the interface around Retrofit endpoints or DAO methods. Shape it
around application operations and domain types. Otherwise the abstraction only
hides a class name while leaking the same volatile details.
