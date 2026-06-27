---
question: "How would you test a repository that combines a network API and Room?"
topic: testing-quality
difficulty: mid
tags: [testing, repository, room, fake]
---

Test the repository as a unit by giving it controlled dependencies: a fake API,
a fake or in-memory data source, and a test dispatcher. Verify behavior rather
than implementation details.

Useful cases include:

- Cached data is returned while a refresh is in progress.
- A successful response is saved and then observed from the database.
- A network failure preserves usable cached data and exposes the right error.
- Repeated refreshes do not create duplicate rows.
- Cancellation stops work instead of being converted into a normal failure.

Add a smaller Room integration test with an in-memory database when queries,
transactions, migrations, or conflict rules are important. There is usually no
value in mocking every DAO call and then asserting that each mock was invoked.
That only repeats the implementation in the test.
