import type { APIRoute } from 'astro';
import { SITE } from '../../consts';
import { openFilePullRequest, GitHubError, type GitHubConfig } from '../../lib/github';

// This route runs on demand (Cloudflare Worker), not at build time.
export const prerender = false;

const LEVELS = ['Intern', 'Junior', 'Mid', 'Senior', 'Staff+'] as const;
const OUTCOMES = ['Offer', 'Rejected', 'Withdrew', 'In Progress', 'No Response'] as const;

type Level = (typeof LEVELS)[number];
type Outcome = (typeof OUTCOMES)[number];

interface Payload {
  company?: string;
  role?: string;
  level?: string;
  location?: string;
  remote?: boolean;
  outcome?: string;
  date?: string;
  author?: string;
  tags?: string;
  body?: string;
  turnstileToken?: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

/** Quote and escape a string so it's a safe single-line YAML scalar. */
const yamlStr = (s: string) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'experience';

async function verifyTurnstile(secret: string, token: string | undefined, ip: string | null) {
  if (!token) return false;
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime?.env ?? ({} as Env);

  if (!env.GITHUB_TOKEN) {
    return json({ error: 'Submissions are not configured on the server yet.' }, 503);
  }

  let p: Payload;
  try {
    p = (await request.json()) as Payload;
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  // Spam protection (skipped when no secret is configured).
  if (env.TURNSTILE_SECRET_KEY) {
    const ip = request.headers.get('CF-Connecting-IP');
    const ok = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, p.turnstileToken, ip);
    if (!ok) return json({ error: 'Captcha verification failed. Please try again.' }, 400);
  }

  // ---- Validate & normalize ----
  const company = (p.company ?? '').trim();
  const body = (p.body ?? '').trim();
  if (!company) return json({ error: 'Company is required.' }, 400);
  if (company.length > 120) return json({ error: 'Company name is too long.' }, 400);
  if (body.length < 30) return json({ error: 'Please write at least a few sentences.' }, 400);
  if (body.length > 20000) return json({ error: 'Write-up is too long (20k char max).' }, 400);

  const role = (p.role ?? '').trim().slice(0, 120) || 'Android Engineer';
  const level: Level = LEVELS.includes(p.level as Level) ? (p.level as Level) : 'Mid';
  const outcome: Outcome = OUTCOMES.includes(p.outcome as Outcome)
    ? (p.outcome as Outcome)
    : 'Offer';
  const location = (p.location ?? '').trim().slice(0, 120);
  const remote = p.remote === true;
  const author = (p.author ?? '').trim().slice(0, 80) || 'Anonymous';

  // Date: accept YYYY-MM-DD, fall back to today.
  let date = (p.date ?? '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
    date = new Date().toISOString().slice(0, 10);
  }

  const tags = (p.tags ?? '')
    .split(',')
    .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
    .filter(Boolean)
    .slice(0, 8);

  // ---- Build the Markdown file ----
  const frontmatter = [
    '---',
    `company: ${yamlStr(company)}`,
    `role: ${yamlStr(role)}`,
    `level: ${yamlStr(level)}`,
    ...(location ? [`location: ${yamlStr(location)}`] : []),
    `remote: ${remote}`,
    `outcome: ${yamlStr(outcome)}`,
    `date: ${date}`,
    `author: ${yamlStr(author)}`,
    `tags: [${tags.map(yamlStr).join(', ')}]`,
    'draft: false',
    '---',
  ].join('\n');

  const fileContent = `${frontmatter}\n\n${body}\n`;

  const rand = Math.random().toString(36).slice(2, 7);
  const slug = `${slugify(company)}-${slugify(role)}`.slice(0, 70);
  const path = `src/content/experiences/${slug}-${rand}.md`;
  const branch = `contrib/experience-${slug}-${rand}`;

  const repoUrl = new URL(SITE.github);
  const [defaultOwner, defaultRepo] = repoUrl.pathname.replace(/^\/|\.git$/g, '').split('/');
  const cfg: GitHubConfig = {
    token: env.GITHUB_TOKEN,
    owner: env.GITHUB_OWNER || defaultOwner,
    repo: env.GITHUB_REPO || defaultRepo,
    baseBranch: env.GITHUB_BASE_BRANCH || 'main',
  };

  try {
    const pr = await openFilePullRequest(cfg, {
      path,
      content: fileContent,
      branch,
      commitMessage: `Add interview experience: ${company} (${role})`,
      prTitle: `Interview experience: ${company} - ${role}`,
      prBody: [
        `Submitted via the on-site contribution form by **${author}**.`,
        '',
        `- **Company:** ${company}`,
        `- **Role:** ${role} (${level})`,
        `- **Outcome:** ${outcome}`,
        location ? `- **Location:** ${location}${remote ? ' (Remote)' : ''}` : null,
        '',
        '> Please review for accuracy, tone, and that no individuals or NDA material are named before merging.',
      ]
        .filter((l) => l !== null)
        .join('\n'),
    });
    return json({ ok: true, url: pr.url, number: pr.number });
  } catch (err) {
    const status = err instanceof GitHubError ? 502 : 500;
    console.error('Experience submission failed:', err);
    return json({ error: 'Could not open the pull request. Please try again later.' }, status);
  }
};
