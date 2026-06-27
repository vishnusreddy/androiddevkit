/// <reference types="astro/client" />

/**
 * Secrets and config bound to the Cloudflare Worker at runtime.
 * Set these with `wrangler secret put <NAME>` (production) or in
 * `.dev.vars` (local). See `.dev.vars.example`.
 */
interface Env {
  /** Fine-grained GitHub token with Contents + Pull requests write on the repo. */
  GITHUB_TOKEN: string;
  /** Repo owner. Defaults to the value in src/consts.ts when unset. */
  GITHUB_OWNER?: string;
  /** Repo name. Defaults to the value in src/consts.ts when unset. */
  GITHUB_REPO?: string;
  /** Branch new PRs target. Defaults to "main". */
  GITHUB_BASE_BRANCH?: string;
  /** Cloudflare Turnstile secret key. When unset, captcha checks are skipped. */
  TURNSTILE_SECRET_KEY?: string;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}

interface ImportMetaEnv {
  /** Public Turnstile site key, rendered into the form. Optional. */
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
