---
question: "Design authentication and token refresh for a mobile app."
topic: system-design
difficulty: mid
order: 80
starred: true
section: "Security and operations"
tags: ["system-design", "auth", "security", "networking"]
---

**The model:** OAuth2/OIDC issues a **short-lived access token** that may last minutes or hours and a **long-lived refresh token** that may last days or months. The access token authorizes API calls; the refresh token gets a new access token when it expires.

**Login flow:**
- Use OAuth 2.0 Authorization Code with PKCE for a native app, normally through
  an external user agent or a trusted identity SDK. A mobile app cannot keep a
  client secret.
- Keep access tokens in memory where practical. If a refresh token must persist,
  encrypt it with a key protected by Android Keystore or use a security-reviewed
  identity library. Keystore stores cryptographic keys, not arbitrary tokens.
- Never put tokens in source code, logs, backups, or unencrypted preferences.

**Transparent refresh (the key client design):**
- An OkHttp **interceptor** attaches the current access token. An
  **`Authenticator`** can respond to a 401 by refreshing and rebuilding the
  request. OkHttp calls it off the main thread, but the refresh must use a client
  that cannot recursively invoke the same authenticator.
- **Serialize concurrent refreshes.** If five requests receive 401 together,
  one refresh should run. Waiting callers must re-check whether another caller
  already installed a newer token before refreshing.
- Stop after a bounded number of authentication attempts. Return `null` from the
  authenticator when credentials are invalid so the client does not loop.
- An **`Interceptor`** attaches the current access token to every request.

**Edge cases to handle:**
- **Refresh token expired or revoked** - clear local credentials and move the
  session to an unauthenticated state. Preserve unsent user work where possible.
- **Refresh token rotation** - persist the replacement atomically. The server
  should detect reuse of an old token and revoke the affected token family.
- **Clock skew** - refresh shortly before expiry or react to 401. Use server
  expiry data rather than trusting the device clock alone.
- **Logout** - revoke server-side when possible, clear credentials and private
  caches, and unregister account-bound push tokens.
- **Multiple accounts** - token store keyed by account.

Biometric authentication can gate access to a Keystore key for sensitive local
operations, but it does not replace server authentication. Certificate pinning
is an additional operational commitment, not a default requirement. If the
threat model needs it, include backup pins and a safe rotation plan.

**Trade-offs to name:** access-token lifetime (security vs refresh frequency), proactive vs reactive refresh (extra check vs a failed request), refresh-token rotation (security vs complexity).
