---
question: "Design authentication and token refresh for a mobile app."
topic: system-design
difficulty: mid
tags: ["system-design", "auth", "security", "networking"]
---

**The model:** OAuth2/OIDC issues a **short-lived access token** (minutes–hours) and a **long-lived refresh token** (days–months). The access token authorizes API calls; the refresh token gets a new access token when it expires.

**Login flow:**
- **OAuth2 with PKCE** (Authorization Code + PKCE) for first-party and social login - avoids embedding secrets in the app.
- Store tokens **securely** - encrypted via **Android Keystore** (EncryptedSharedPreferences / encrypted DataStore). Never plain prefs.

**Transparent refresh (the key client design):**
- Use OkHttp's **`Authenticator`**, which fires automatically on a **401**: refresh the token and retry the original request - invisible to the rest of the app.
```kotlin
class TokenAuthenticator(private val store: TokenStore, private val api: AuthApi) : Authenticator {
    override fun authenticate(route: Route?, response: Response): Request? {
        val newToken = runBlocking { refreshOnce() } ?: return null  // give up → log out
        return response.request.newBuilder()
            .header("Authorization", "Bearer $newToken").build()
    }
}
```
- **Serialize concurrent refreshes** - if 5 requests 401 at once, only **one** refresh should run (a `Mutex`); the others wait and reuse the new token. Otherwise you fire 5 refreshes and may invalidate each other.
- An **`Interceptor`** attaches the current access token to every request.

**Edge cases to handle:**
- **Refresh token expired/revoked** → force logout, clear tokens, send to login.
- **Refresh token rotation** - many servers issue a new refresh token each refresh; store the latest, handle reuse-detection (a replayed old token = possible theft → invalidate session).
- **Clock skew** - refresh slightly **before** expiry (proactive) or rely on 401 (reactive); proactive avoids a failed request.
- **Logout** - revoke server-side, clear local tokens, clear caches, cancel the device push token.
- **Multiple accounts** - token store keyed by account.

**Security:** Keystore-backed storage, HTTPS + cert pinning, biometric gate for sensitive apps, no tokens in logs.

**Trade-offs to name:** access-token lifetime (security vs refresh frequency), proactive vs reactive refresh (extra check vs a failed request), refresh-token rotation (security vs complexity).
