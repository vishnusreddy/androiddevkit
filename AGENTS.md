# Repository guidance for coding agents

## Browser compatibility

- Treat a UI change as incomplete until it has been checked in both Chromium and Safari/WebKit at desktop and mobile widths. A successful build or a Chromium-only check is not sufficient.
- Do not rely on browser-native form-control styling. Normalize `appearance`, height, padding, typography, colors, and affordances for selects and inputs, then verify light and dark themes in Safari.
- Exercise every interactive state: default, hover, focus, selected, disabled, error, and completed. Selected state must remain visibly distinct after the control becomes disabled.
- Inspect the full interaction after content expands or state changes. Remove accidental borders, dividers, overflow, or spacing artifacts instead of accepting them as browser differences.

## Editorial quality

- Treat interview content as technical documentation: name the exact API,
  exception, lifecycle state, and failure condition instead of using vague
  phrases such as "it throws" or "it doesn't work."
- Questions must test one clear concept. MCQ distractors must be plausible,
  mutually exclusive, and free of joke answers; explanations must cover both
  the mechanism and its important boundary or caveat.
- Distinguish guarantees from common behavior, transient saved UI state from
  durable storage, and best-effort delivery from acknowledged delivery.
- Run `npm run content:check` after changing any question, answer, or practice
  item. The production build runs this check automatically.
