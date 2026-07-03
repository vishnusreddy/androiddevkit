---
question: "How would you design the networking layer of an Android app?"
topic: system-design
difficulty: mid
order: 20
starred: true
section: "Client foundations"
tags: ["system-design", "networking", "retrofit", "okhttp"]
---

A robust networking layer is built on **Retrofit + OkHttp + a serializer**, with cross-cutting concerns handled by **interceptors**.

**The stack:**
- **Retrofit** - type-safe API interface (`suspend fun getUser(): User`), turns HTTP into Kotlin functions.
- **OkHttp** - the HTTP client: connection pooling, timeouts, disk cache, **interceptors**.
- **Serializer** - **kotlinx.serialization** or **Moshi** (codegen, no reflection → R8-friendly).

**Interceptors do the cross-cutting work** (chain-of-responsibility / decorator pattern):
```kotlin
OkHttpClient.Builder()
    .addInterceptor(AuthInterceptor(tokenProvider))      // add auth header
    .addInterceptor(HttpLoggingInterceptor())            // logging (debug only)
    .addInterceptor(BoundedRetryInterceptor())           // only safe transient requests
    .addNetworkInterceptor(CacheControlInterceptor())    // tune caching
    .authenticator(TokenAuthenticator(refresher))        // 401 → refresh token & retry
    .certificatePinner(pinner)                            // pin certs
    .connectTimeout(15, SECONDS).build()
```

**Key concerns to cover:**
- **Auth & token refresh** - an `Authenticator` transparently refreshes the access token on `401` and retries; serialize concurrent refreshes (mutex) so you refresh once.
- **Error handling** - map HTTP/`IOException`/timeouts to **typed domain results** at the repository boundary; expose retry/error to the UI.
- **Retries & backoff** - understand OkHttp's built-in connection retry before
  adding another layer. Retry only bounded, transient failures with jitter, and
  never replay a non-idempotent write without an idempotency key.
- **Caching** - OkHttp disk cache + `Cache-Control`/`ETag`; offline-first via Room.
- **Request dedup / coalescing** - collapse identical in-flight requests; cancel on screen leave (coroutine cancellation cancels the call).
- **Security** - require HTTPS, keep secrets out of the app and logs, protect
  persistent credentials with a Keystore-backed design, and add certificate
  pinning only when the threat model and rotation plan justify it.
- **Observability** - logging (debug), metrics, and correlation IDs.
- **Threading** - Retrofit's suspend adapter enqueues the network call without
  blocking the caller thread and resumes the continuation when the response is
  ready. Keep any heavy mapping or independent blocking I/O on an appropriate
  dispatcher, and rely on structured cancellation to cancel the HTTP call.

**REST vs GraphQL** - Retrofit for REST; **Apollo** for GraphQL (one query fetches exactly what the screen needs, reducing over/under-fetching). Mention based on the API.
