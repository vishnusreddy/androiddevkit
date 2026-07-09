---
question: "How do you store a secret so a rooted device cannot trivially read it? Explain the Keystore, file-based encryption, and their limits."
topic: platform-internals
difficulty: senior
order: 80
starred: true
section: "Security and hardening"
tags: ["keystore", "encryption", "security", "fbe"]
---

The honest framing first: you cannot make a client-side secret truly unreadable to
someone who controls the device. What you can do is make key material
non-extractable and make data unreadable at rest. Knowing both the mechanism and
its ceiling is what separates a strong answer from a naive one.

**The Android Keystore is the foundation.** It lets you generate and use
cryptographic keys whose raw bytes your app can never read back. You ask the
Keystore to encrypt, sign, or decrypt, and it does the operation without ever
handing you the key. On most modern devices the key lives in a **hardware-backed**
store: a Trusted Execution Environment (TEE), or a dedicated secure element via
**StrongBox** on devices that support it. So even on a rooted device an attacker
cannot dump the raw key out of your app's memory or storage. You can also gate a
key behind user authentication, so it only unlocks after a biometric or PIN.

**File-Based Encryption (FBE) protects data at rest.** Since Android 10 it is the
standard. Each file is encrypted with keys derived from the user's credentials,
and there are two classes of storage:

- **Credential Encrypted (CE):** the default, unlocked only **after the user first
  unlocks** the device after boot. Most app data lives here.
- **Device Encrypted (DE):** available **before** first unlock, for the few things
  that must run at boot (for example, an alarm or a Direct Boot component).

This is why an attacker who steals a powered-off device cannot read CE data without
the credential.

**For app-level secrets**, the common building block was **EncryptedSharedPreferences
/ EncryptedFile** from Jetpack Security, which wraps a master key held in the
Keystore. Note that the Jetpack Security Crypto library is now in maintenance mode,
so for new work prefer using the Keystore with a vetted crypto library such as
Tink directly, and keep the same pattern: the data key is protected by a
hardware-backed Keystore key.

**The limits you must state out loud:**

- The Keystore protects key **extraction**, not key **use**. On a rooted device
  with your app running, an attacker can ask your app (or hook it) to perform the
  operation the key allows, exactly as your code would.
- Anything shipped inside the APK (an API key in resources, a hardcoded string) can
  be extracted by decompiling, and obfuscation does not encrypt it.
- Therefore genuine secrets belong on your **server**. Use the client to hold
  short-lived tokens, pin certificates, and attest the app and device with the
  **Play Integrity API**, and design so that a compromised client cannot do more
  than that user could anyway.

The summary: use a hardware-backed Keystore key so raw key bytes are never
exposed, rely on FBE for data at rest, and remember the ceiling, which is that the
device owner can always use a key that is usable on the device, so the real secrets
stay on the server.
