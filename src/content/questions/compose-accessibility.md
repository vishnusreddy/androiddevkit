---
question: "How do you make a Compose screen accessible?"
topic: jetpack-compose
difficulty: mid
order: 300
starred: false
section: "Everyday UI"
tags: ["compose", "accessibility", "semantics"]
---

Compose builds a **semantics tree** parallel to the UI tree - it's what TalkBack reads and what UI tests query. Much of it is automatic; you fill the gaps.

```kotlin
// Icons/images need a contentDescription (or null if purely decorative)
Icon(Icons.Default.Favorite, contentDescription = "Add to favorites")
Image(painter, contentDescription = null)   // decorative → skipped by TalkBack

// Add or override semantics
Modifier.semantics {
    contentDescription = "Profile photo of $name"
    role = Role.Button
    stateDescription = if (selected) "Selected" else "Not selected"
}

// Merge children into one announcement (e.g. a whole card read as one node)
Modifier.semantics(mergeDescendants = true) { }
Row(Modifier.clickable {}.semantics(mergeDescendants = true)) {
    Icon(...); Text("Settings")   // announced together, not separately
}
```

Key points:
- **`contentDescription`** on `Icon`/`Image` is required for non-decorative graphics; pass `null` for decorative ones so they're ignored.
- **`mergeDescendants`** groups child semantics into a single focusable node - important so a card isn't read as five separate items. `clickable`/`toggleable` merge automatically.
- **`role`**, **`stateDescription`**, **`onClick` label** make custom controls understandable to assistive tech.
- **Touch targets** should be ≥ 48dp (`Modifier.minimumInteractiveComponentSize()` / `sizeIn`).
- **`testTag`** is also part of semantics (used by tests; excluded from accessibility by default).
- Respect **font scaling** - use `sp` for text and avoid fixed heights that clip scaled text; honor dark mode and contrast.
