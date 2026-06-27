# AndroidDevKit

> Your one-stop, open-source kit for landing the Android job.

[**androiddevkit.com**](https://androiddevkit.com) is a community-built
destination for Android engineers preparing to switch jobs - curated interview
questions, topic-by-topic guides, and real interview experiences. No paywall, no
sign-up, ever.

Built with [Astro](https://astro.build), authored in Markdown, and deployed on
Cloudflare Pages.

## What's inside

- **Topics** - Kotlin, Coroutines, Jetpack Compose, architecture, system design, and more.
- **Question bank** - standalone, difficulty-tagged questions with answers that explain the *why*.
- **Interview experiences** - first-hand write-ups of real interviews.
- **Blog** - longer guides on preparing, negotiating, and growing as a mobile engineer.

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

| Command           | Action                                       |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start the dev server                         |
| `npm run build`   | Build the static site to `./dist/`           |
| `npm run preview` | Preview the production build locally         |

## Project structure

```
src/
├── content/
│   ├── topics/        # one file per topic (the spine of the site)
│   ├── questions/     # one file per Q&A, references a topic
│   ├── experiences/   # one file per interview write-up
│   └── blog/          # articles & guides
├── components/        # UI building blocks
├── layouts/           # page shells
├── pages/             # routes
└── styles/            # design tokens & global CSS
```

Content schemas live in [`src/content.config.ts`](./src/content.config.ts).

## Deployment

Static build on **Cloudflare Pages**:

- **Build command:** `npm run build`
- **Output directory:** `dist`

Every merged PR to `main` triggers an automatic deploy.

## License

[MIT](./LICENSE) - content and code. Use it, fork it, learn from it.
