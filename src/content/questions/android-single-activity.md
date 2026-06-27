---
question: "What is the single-Activity architecture, and why is it recommended?"
topic: android-fundamentals
difficulty: mid
tags: ["architecture", "navigation", "fragments"]
---

**Single-Activity architecture** means the app has **one Activity** that hosts all screens as **fragments** (or **composables**), with the **Navigation component** managing movement between them - instead of one Activity per screen.

```
MainActivity
└── NavHost
    ├── FeedFragment / FeedScreen
    ├── DetailFragment / DetailScreen
    └── ProfileFragment / ProfileScreen
```

**Why it's recommended (Google's guidance since ~2018, and the default with Compose):**
- **Simpler, centralized navigation** - one back stack managed by the Nav controller, with type-safe args, deep-link support, and animated transitions, instead of juggling Activity intents and flags.
- **Cheaper transitions** - switching fragments/composables is lighter than launching Activities (no new window/task setup).
- **Easy shared UI & scoped state** - shared elements, a persistent bottom nav, and **graph-scoped ViewModels** (share state across a flow like checkout) are natural.
- **Less manifest/lifecycle boilerplate** - no per-screen Activity declarations, launch modes, or result plumbing.
- **One place** for app-wide concerns (insets, theming, snackbars).

**Trade-offs / when multiple Activities still make sense:**
- Genuinely **separate entry points** or windows (a share target, a settings screen launched by the system, picture-in-picture).
- **Modularization** boundaries or legacy code where a feature is its own Activity.
- Integrations that **require** an Activity (some SDKs, `launchMode` needs).

**With Compose:** the same idea - a single Activity with a `NavHost` of composable destinations. Multiple Activities become the exception, not the rule.
