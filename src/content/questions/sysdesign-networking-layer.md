---
question: "How would you design the networking layer of an Android app?"
topic: system-design
difficulty: mid
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
    .addInterceptor(RetryInterceptor())                  // retry transient failures
    .addNetworkInterceptor(CacheControlInterceptor())    // tune caching
    .authenticator(TokenAuthenticator(refresher))        // 401 → refresh token & retry
    .certificatePinner(pinner)                            // pin certs
    .connectTimeout(15, SECONDS).build()
```

**Key concerns to cover:**
- **Auth & token refresh** - an `Authenticator` transparently refreshes the access token on `401` and retries; serialize concurrent refreshes (mutex) so you refresh once.
- **Error handling** - map HTTP/`IOException`/timeouts to **typed domain results** at the repository boundary; expose retry/error to the UI.
- **Retries & backoff** - exponential backoff with jitter for transient failures; **don't** retry non-idempotent writes blindly; consider a **circuit breaker** for a failing host.
- **Caching** - OkHttp disk cache + `Cache-Control`/`ETag`; offline-first via Room.
- **Request dedup / coalescing** - collapse identical in-flight requests; cancel on screen leave (coroutine cancellation cancels the call).
- **Security** - **certificate pinning**, HTTPS only, no secrets in code, secure token storage (Keystore/EncryptedSharedPreferences).
- **Observability** - logging (debug), metrics, and correlation IDs.
- **Threading** - Retrofit `suspend` functions run on a background dispatcher; cancellation via structured concurrency.

**REST vs GraphQL** - Retrofit for REST; **Apollo** for GraphQL (one query fetches exactly what the screen needs, reducing over/under-fetching). Mention based on the API.
