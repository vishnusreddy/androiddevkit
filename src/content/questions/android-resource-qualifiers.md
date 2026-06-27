---
question: "How does Android's resource system and configuration qualifiers work?"
topic: android-fundamentals
difficulty: junior
tags: ["resources", "configuration", "localization"]
---

Android picks the **best-matching resource** for the current device configuration at runtime, using **qualified resource directories**. You provide alternatives; the system selects.

```
res/
├── values/strings.xml            # default
├── values-es/strings.xml         # Spanish
├── values-night/colors.xml       # dark mode
├── drawable-hdpi/ic.png          # density buckets
├── drawable-xxhdpi/ic.png
├── layout/activity_main.xml      # default layout
├── layout-sw600dp/activity_main.xml   # tablets (smallest width ≥ 600dp)
└── mipmap-xxhdpi/ic_launcher.png # launcher icons
```

Common qualifiers (in precedence order): **locale** (`-es`, `-fr`), **layout direction** (`-ldrtl`), **smallest width** (`-sw600dp`), **screen width/orientation** (`-w820dp`, `-land`), **night mode** (`-night`), **density** (`-hdpi`/`-xxhdpi`), and **API level** (`-v29`).

**Why it matters:**
- **Localization** — translate by adding `values-<lang>` folders; never hardcode strings (use `@string/...` and `getString()`).
- **Dark mode** — `values-night` / `-night` resources are auto-selected; no code branching.
- **Density independence** — provide density buckets (or a single vector drawable that scales) so images look crisp on all screens; use **dp** for layout and **sp** for text.
- **Responsive layouts** — `-sw600dp`/`-w600dp` for tablets and foldables.
- **API-specific** — `-v29` for resources only valid on newer APIs.

**Points interviewers want:**
- The system **falls back** to the default (`values/`) when no qualified match exists.
- Use **vector drawables** to avoid shipping many density PNGs.
- Access in code via `R.string.x`, `R.drawable.y`; the qualifier resolution is automatic.
- A **configuration change** (rotation, locale, dark mode) re-resolves resources — which is why the Activity recreates.

**Soundbite:** "Resources live in qualified folders (`values-es`, `-night`, `-sw600dp`, density buckets); Android auto-selects the best match for the current config and falls back to the default — that's how localization, dark mode, and multi-screen support work without code branches."
