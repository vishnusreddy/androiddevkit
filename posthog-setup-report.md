<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Android Dev Kit Astro hybrid project. PostHog client-side tracking (`posthog-js`) is initialized in the shared `BaseLayout.astro` via a new `src/components/posthog.astro` snippet component, covering every page on the site. A server-side singleton (`src/lib/posthog-server.ts`) using `posthog-node` tracks the contributions API route. Events capture the full practice session lifecycle, question engagement actions, and community contribution submissions.

| Event | Description | File |
|---|---|---|
| `practice_session_started` | Fired when a user starts an interview practice session with their chosen configuration. | `src/pages/practice/index.astro` |
| `practice_session_completed` | Fired when a practice session ends (finished or timed out), capturing the final score and stats. | `src/pages/practice/index.astro` |
| `practice_mcq_answered` | Fired each time a user submits an answer to an MCQ question, tracking correctness by topic and difficulty. | `src/pages/practice/index.astro` |
| `question_bookmarked` | Fired when a user saves or unsaves a question for later review. | `src/lib/bookmarks.ts` |
| `question_marked_done` | Fired when a user marks or unmarks a question as complete in their study progress. | `src/lib/progress.ts` |
| `contribution_created` | Server-side: fired after a community contribution is successfully submitted and a PR or issue is opened. | `src/pages/api/contributions.ts` |
| `contribution_submitted` | Client-side: fired when the contribution form is successfully submitted from the browser. | `src/pages/contribute/submit.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/498821/dashboard/1801793)
- [Practice sessions started (daily)](https://us.posthog.com/project/498821/insights/QSQvU6wC)
- [Practice session completion funnel](https://us.posthog.com/project/498821/insights/G17ZhAuk)
- [MCQ accuracy rate (correct / total)](https://us.posthog.com/project/498821/insights/bnkB9ivu)
- [Question engagement (bookmarks + done)](https://us.posthog.com/project/498821/insights/BgqNPW1U)
- [Community contributions submitted](https://us.posthog.com/project/498821/insights/kZHEP77J)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
