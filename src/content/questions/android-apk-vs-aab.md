---
question: "What's the difference between an APK and an Android App Bundle (AAB)?"
topic: android-fundamentals
difficulty: junior
tags: ["aab", "apk", "distribution"]
---

- **APK** - the installable package that lands on a device. It contains **all** code and resources for **every** density, ABI, and language.
- **AAB (Android App Bundle)** - a **publishing format** (`.aab`) you upload to Play. It's **not installed directly**; Play uses it to generate and serve **optimized APKs per device** via **Play Feature/Dynamic Delivery**.

**The win - smaller downloads.** With an AAB, Play's **split APKs** ship only what a given device needs:
- **Density splits** - only that device's drawable density.
- **ABI splits** - only that device's CPU architecture (arm64 vs x86).
- **Language splits** - only the user's languages.

So a user doesn't download xxhdpi assets, French strings, and x86 libraries they'll never use. AAB is **required** for new apps on Google Play (since Aug 2021).

**Related capabilities AAB enables:**
- **Dynamic feature modules** - download features **on demand** (`Play Feature Delivery`), shrinking the base install.
- **Play Asset Delivery** - stream large game assets.
- **Play App Signing** - Google holds the signing key and re-signs the generated APKs (a consequence to understand: you upload with an upload key, Play signs with the app key).

**What to remember:**
- AAB ≠ APK: AAB is for **upload/distribution**; APK is for **install**.
- You can still build a **universal APK** from a bundle (`bundletool`) for sideloading/testing.
- It **reduces app size** without code changes - the splits are automatic.
