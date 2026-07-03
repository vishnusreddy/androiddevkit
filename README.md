# AndroidDevKit

> Your one-stop, open-source kit for landing the Android job.

[**androiddevkit.com**](https://androiddevkit.com) is a community-built
destination for Android engineers preparing to switch jobs — curated interview
questions, topic-by-topic guides, timed practice sessions, and real interview
experiences. No paywall, no sign-up, ever.

Built with [Astro](https://astro.build), authored in Markdown, and deployed on
Cloudflare Pages.

## Features

- **Topic guides** — 8 in-depth guides covering Kotlin, Coroutines, Jetpack
  Compose, Android architecture, system design, and more, each anchored to its
  own curated question bank.
- **Question bank** — 250+ standalone, difficulty-tagged questions (junior,
  mid, senior) with answers that explain the *why*, not just the *what*.
- **Interview Practice mode** — build a timed 10–20 question mock interview by
  topic, format (MCQ, written rehearsal, or mixed), and difficulty. Answer
  under pressure, score your run, and chase your personal best.
- **Progress tracker** — mark questions as done and track readiness per topic.
  Saved privately in your browser; no login required.
- **Interview experiences** — first-hand write-ups of real interviews,
  including rounds, questions asked, and outcome.
- **Blog** — longer-form guides on preparing, negotiating, and growing as a
  mobile engineer.
- **Instant site-wide search** — a single search overlay indexes every topic,
  question, experience, company, and blog post for zero-latency lookup.
- **Editorial policy & content quality gate** — every contribution is checked
  for accuracy, clarity, and level before it ships, enforced automatically by
  `npm run content:check` in CI.
- **Fully open source** — every question, answer, and article lives in this
  repo as Markdown. Fix a typo, add a question, or share your interview in
  minutes.

## Contributing

This site is only as good as the community makes it. Adding a question, fixing
an answer, or sharing your interview experience is just a Markdown file and a
pull request. See **[CONTRIBUTING.md](./CONTRIBUTING.md)** or the
[Contribute page](https://androiddevkit.com/contribute/).

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
```

| Command                  | Action                                        |
| ------------------------ | --------------------------------------------- |
| `npm run dev`             | Start the dev server                         |
| `npm run content:check`   | Validate content quality (runs before build) |
| `npm run build`           | Build the static site to `./dist/`           |
| `npm run preview`         | Build, then preview with Wrangler locally    |
| `npm run deploy`          | Build and deploy via Wrangler                |

## Project structure

```
src/
├── content/
│   ├── topics/        # one file per topic (the spine of the site)
│   ├── questions/     # one file per Q&A, references a topic
│   ├── experiences/   # one file per interview write-up
│   └── blog/          # articles & guides
├── data/               # practice-mode MCQ bank
├── components/         # UI building blocks
├── layouts/            # page shells
├── pages/              # routes (incl. practice, progress, search index, RSS)
└── styles/             # design tokens & global CSS
```

Content schemas live in [`src/content.config.ts`](./src/content.config.ts).

## Deployment

Static build on **Cloudflare Pages**:

- **Build command:** `npm run build`
- **Output directory:** `dist`

Every merged PR to `main` triggers an automatic deploy.

## License

[MIT](./LICENSE) — content and code. Use it, fork it, learn from it.
