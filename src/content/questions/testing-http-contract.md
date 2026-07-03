---
question: "How do you test an Android networking layer without calling a real backend?"
topic: testing-quality
difficulty: mid
order: 70
starred: true
section: "Data and network boundaries"
tags: ["testing", "networking", "mockwebserver", "retrofit", "serialization"]
---

Use two complementary test levels.

**Unit-test policy and mapping** with a fake API. This is where you cover retry
decisions, DTO-to-domain mapping, cache behavior, and error classification.

**Contract-test the HTTP client** against a local server such as OkHttp
`MockWebServer`. It exercises the real Retrofit service, converter, headers,
interceptors, request body, and response parsing without depending on the
internet or a shared test environment.

```kotlin
@Test fun sendsCursorAndParsesNextPage() = runTest {
    server.enqueue(MockResponse().setBody(
        """{"items":[{"id":"42"}],"nextCursor":"abc"}"""
    ))

    val page = api.feed(cursor = "old")
    val request = server.takeRequest()

    assertEquals("/feed?cursor=old", request.path)
    assertEquals("42", page.items.single().id)
    assertEquals("abc", page.nextCursor)
}
```

High-value cases include malformed JSON, missing optional fields, unknown enum
values, empty bodies, non-2xx errors, timeouts, cancellation, authentication
headers, and error-body parsing. Keep JSON fixtures small and readable, and add
a regression fixture whenever a real backend response breaks the app.

Mocks that return already-parsed DTOs cannot catch a wrong field name, converter
configuration, or interceptor bug. A local HTTP test can. It still does not prove
that the deployed backend honors the contract, so mature teams also validate an
OpenAPI or GraphQL schema in CI and run a small number of staging smoke tests.
