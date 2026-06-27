---
question: "What are the most important ways to secure a mobile app?"
topic: system-design
difficulty: mid
tags: ["system-design", "security", "auth"]
---

Security on the client spans storage, transport, and code.

**Credential / token storage:**
- **Never** store tokens in plain `SharedPreferences` or in code.
- Use the **Android Keystore** - hardware-backed keys that can't be extracted - to encrypt secrets, or **EncryptedSharedPreferences** / encrypted DataStore (Jetpack Security) which use Keystore under the hood.
- Prefer **short-lived access tokens** + a **refresh token**; store the refresh token securely; rotate on use.
- For high-security apps, gate access behind **BiometricPrompt**.

**Transport security:**
- **HTTPS/TLS only**; block cleartext (`android:usesCleartextTraffic="false"`, network security config).
- **Certificate pinning** (OkHttp `CertificatePinner` or network-security-config) to defeat MITM with rogue CAs - but **plan for rotation** (pin backups; a wrong pin can brick the app).

**Data at rest:**
- Encrypt sensitive local data (SQLCipher for Room, EncryptedFile). App-private storage by default; never sensitive data on shared storage.
- Clear caches/tokens on **logout**.

**Code & runtime hardening:**
- **R8/ProGuard** obfuscation (raises the bar, not a guarantee).
- **No secrets in the APK** - API keys in an APK are extractable; keep secrets server-side, use short-lived/scoped tokens, and a backend proxy for sensitive 3rd-party calls.
- **Root/tamper detection**, Play Integrity API for high-value apps.
- Validate inputs; beware insecure deep links / exported components / intent redirection (`PendingIntent` immutability).

**Authentication:**
- **OAuth2 / OIDC** with PKCE for the auth flow; tokens via the secure storage above.
- **Transparent token refresh** (OkHttp `Authenticator` on 401), serialized to refresh once.

**Common mobile vulns (OWASP Mobile):** insecure data storage, weak transport security, hardcoded secrets, insecure IPC/deep links, insufficient cryptography.

**Trade-offs to name:** cert pinning (MITM protection vs rotation/ops risk), encryption (security vs minor perf), root detection (security vs false positives/UX), strictness vs developer/QA friction.
