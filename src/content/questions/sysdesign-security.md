---
question: "What are the most important ways to secure a mobile app?"
topic: system-design
difficulty: mid
order: 120
starred: true
section: "Security and operations"
tags: ["system-design", "security", "auth"]
---

Security on the client spans storage, transport, and code.

**Credentials and keys:**
- Never store tokens in source code, logs, or unencrypted preferences.
- Android Keystore protects cryptographic key material and may provide
  hardware-backed or StrongBox storage when the device supports it. Use a
  Keystore-protected key to encrypt sensitive values; do not imply that Keystore
  stores arbitrary strings.
- Prefer short-lived, scoped access tokens. Minimize persistent refresh-token
  storage and support rotation and revocation.
- `BiometricPrompt` can authorize use of a key for sensitive local actions. It
  does not make an otherwise insecure protocol safe.

**Transport security:**
- **HTTPS/TLS only**; block cleartext (`android:usesCleartextTraffic="false"`, network security config).
- Consider certificate pinning only when the threat model justifies its outage
  and rotation risk. Use backup pins and a tested recovery plan.

**Data at rest:**
- Use app-private storage and encrypt data whose threat model requires protection
  beyond the platform sandbox. Protect encryption keys with Keystore.
- Clear caches/tokens on **logout**.

**Code & runtime hardening:**
- **R8/ProGuard** obfuscation (raises the bar, not a guarantee).
- **No secrets in the APK** - API keys in an APK are extractable; keep secrets server-side, use short-lived/scoped tokens, and a backend proxy for sensitive 3rd-party calls.
- Treat Play Integrity and tamper signals as inputs to a server-side risk
  decision, not proof that a device is trustworthy. Root checks can be bypassed
  and can produce false positives.
- Validate inputs; beware insecure deep links / exported components / intent redirection (`PendingIntent` immutability).

**Authentication:**
- **OAuth2 / OIDC** with PKCE for the auth flow; tokens via the secure storage above.
- **Transparent token refresh** (OkHttp `Authenticator` on 401), serialized to refresh once.

Also review exported components, mutable `PendingIntent` use, deep-link input,
WebView bridges, backup policy, screenshots on sensitive screens, dependency
supply chain, and redaction of telemetry.

**Trade-offs to name:** cert pinning (MITM protection vs rotation/ops risk), encryption (security vs minor perf), root detection (security vs false positives/UX), strictness vs developer/QA friction.
