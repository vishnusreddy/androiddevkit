# Contributing to AndroidDevKit

Thank you for helping Android engineers land their next role! Everything here is
Markdown + pull requests — no CMS, no login.

## Quick start

```bash
# 1. Fork the repo on GitHub, then:
git clone https://github.com/<you>/androidevkit.git
cd androidevkit
npm install
npm run dev          # preview at http://localhost:4321

# 2. Create a branch, add a file, commit
git checkout -b add-coroutines-question

# 3. Push and open a Pull Request
git push origin add-coroutines-question
```

Keep each PR focused on **one thing** — it gets reviewed and merged faster.

## Adding an interview question

Create a Markdown file in `src/content/questions/`, e.g.
`structured-concurrency.md`:

```markdown
---
question: "What is structured concurrency in Kotlin coroutines?"
topic: coroutines        # must match a file id in src/content/topics/
difficulty: mid          # junior | mid | senior
tags: ["coroutines", "scopes"]
author: "Your Name"      # optional
---

Your answer in Markdown. Explain the **why** and the trade-offs — that's what
interviewers actually probe for. Code blocks are syntax-highlighted:

​```kotlin
viewModelScope.launch { /* ... */ }
​```
```

## Sharing an interview experience

Create a file in `src/content/experiences/`. Anonymize freely
(`author: "Anonymous"` is welcome).

```markdown
---
company: "Acme Corp"
role: "Senior Android Engineer"
level: "Senior"          # Intern | Junior | Mid | Senior | Staff+
location: "Bengaluru, India"
remote: false
outcome: "Offer"         # Offer | Rejected | Withdrew | In Progress | No Response
date: 2026-05-12
author: "Anonymous"
tags: ["compose", "system-design"]
---

## Round 1 — Phone screen
...
```

## Adding a topic

Topics are the spine of the site. Add a file in `src/content/topics/` — the
**filename (without extension) becomes the topic `id`** that questions reference.

```markdown
---
title: "Coroutines"
description: "Structured concurrency, scopes, dispatchers, and Flow."
category: "Kotlin"
order: 10                # lower sorts first within a category
icon: "⟳"
---

Optional overview shown above the questions.
```

## Writing a blog post

Longer guides go in `src/content/blog/` with `title`, `description`, and `date`
frontmatter. Markdown and MDX are both supported.

## Review guidelines

- **Be accurate.** Answers must be correct and current. Cite sources where useful.
- **Be respectful.** Never name individual interviewers. No proprietary or NDA-bound material.
- **Be concise.** Explain reasoning, not just definitions.
- **Run it locally.** `npm run build` should pass before you open the PR.

## Code of conduct

Be kind and constructive. We're all here to help each other grow.
