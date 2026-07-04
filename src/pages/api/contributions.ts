import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../../consts';
import {
  GitHubError,
  openFilePullRequest,
  openIssue,
  type GitHubConfig,
} from '../../lib/github';

export const prerender = false;

const TYPES = ['question', 'experience', 'topic', 'correction', 'article'] as const;
const DIFFICULTIES = ['junior', 'mid', 'senior'] as const;
const LEVELS = ['Intern', 'Junior', 'Mid', 'Senior', 'Staff+'] as const;
const OUTCOMES = ['Offer', 'Rejected', 'Withdrew', 'In Progress', 'No Response'] as const;

type ContributionType = (typeof TYPES)[number];

interface Payload {
  type?: string;
  author?: string;
  tags?: string;
  turnstileToken?: string;
  [key: string]: unknown;
}

interface PreparedPullRequest {
  kind: 'pull-request';
  path: string;
  content: string;
  branch: string;
  commitMessage: string;
  prTitle: string;
  prBody: string;
}

interface PreparedIssue {
  kind: 'issue';
  title: string;
  body: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const text = (value: unknown, max: number) =>
  (typeof value === 'string' ? value : '').trim().slice(0, max);

const requiredText = (value: unknown, label: string, min: number, max: number) => {
  const normalized = text(value, max + 1);
  if (normalized.length < min) throw new ValidationError(`${label} is required.`);
  if (normalized.length > max) throw new ValidationError(`${label} is too long.`);
  return normalized;
};

const yamlStr = (value: string) =>
  `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, ' ')}"`;

const slugify = (value: string, fallback: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || fallback;

const parseTags = (value: unknown) =>
  text(value, 240)
    .split(',')
    .map((tag) => tag.trim().toLowerCase().replace(/^#/, ''))
    .filter(Boolean)
    .slice(0, 8);

const frontmatter = (lines: string[]) => ['---', ...lines, '---'].join('\n');

class ValidationError extends Error {}

async function verifyTurnstile(secret: string, token: string | undefined, ip: string | null) {
  if (!token) return false;
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });
  const data = (await response.json()) as { success: boolean };
  return data.success === true;
}

function githubConfig(env: Env): GitHubConfig {
  const repoUrl = new URL(SITE.github);
  const [defaultOwner, defaultRepo] = repoUrl.pathname.replace(/^\/|\.git$/g, '').split('/');
  return {
    token: env.GITHUB_TOKEN,
    owner: env.GITHUB_OWNER || defaultOwner,
    repo: env.GITHUB_REPO || defaultRepo,
    baseBranch: env.GITHUB_BASE_BRANCH || 'main',
  };
}

function prepareQuestion(p: Payload, rand: string, topicIds: Set<string>): PreparedPullRequest {
  const question = requiredText(p.question, 'Question', 10, 240);
  const answer = requiredText(p.answer, 'Answer', 80, 20000);
  const topic = text(p.topic, 80);
  if (!topicIds.has(topic)) throw new ValidationError('Choose a valid topic.');
  const difficulty = DIFFICULTIES.includes(p.difficulty as (typeof DIFFICULTIES)[number])
    ? p.difficulty
    : 'mid';
  const author = text(p.author, 80) || 'Anonymous';
  const tags = parseTags(p.tags);
  const sources = text(p.sources, 2000);
  const body = sources ? `${answer}\n\n## Sources\n\n${sources}` : answer;
  const slug = slugify(question, 'question');

  return {
    kind: 'pull-request',
    path: `src/content/questions/${slug}-${rand}.md`,
    content: `${frontmatter([
      `question: ${yamlStr(question)}`,
      `topic: ${topic}`,
      `difficulty: ${difficulty}`,
      `tags: [${tags.map(yamlStr).join(', ')}]`,
      `author: ${yamlStr(author)}`,
    ])}\n\n${body}\n`,
    branch: `contrib/question-${slug}-${rand}`,
    commitMessage: `Add interview question: ${question}`,
    prTitle: `Interview question: ${question}`,
    prBody: `Submitted via the on-site contribution form by **${author}**.\n\n- **Topic:** ${topic}\n- **Difficulty:** ${difficulty}\n\n> Please review the API names, guarantees, boundaries, and sources before merging.`,
  };
}

function prepareExperience(p: Payload, rand: string): PreparedPullRequest {
  const company = requiredText(p.company, 'Company', 1, 120);
  const body = requiredText(p.body, 'Write-up', 30, 20000);
  const role = text(p.role, 120) || 'Android Engineer';
  const level = LEVELS.includes(p.level as (typeof LEVELS)[number]) ? p.level : 'Mid';
  const outcome = OUTCOMES.includes(p.outcome as (typeof OUTCOMES)[number])
    ? p.outcome
    : 'Offer';
  const location = text(p.location, 120);
  const remote = p.remote === true;
  const author = text(p.author, 80) || 'Anonymous';
  const tags = parseTags(p.tags);
  let date = text(p.date, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
    date = new Date().toISOString().slice(0, 10);
  }
  const slug = `${slugify(company, 'company')}-${slugify(role, 'role')}`.slice(0, 70);

  return {
    kind: 'pull-request',
    path: `src/content/experiences/${slug}-${rand}.md`,
    content: `${frontmatter([
      `company: ${yamlStr(company)}`,
      `role: ${yamlStr(role)}`,
      `level: ${yamlStr(String(level))}`,
      ...(location ? [`location: ${yamlStr(location)}`] : []),
      `remote: ${remote}`,
      `outcome: ${yamlStr(String(outcome))}`,
      `date: ${date}`,
      `author: ${yamlStr(author)}`,
      `tags: [${tags.map(yamlStr).join(', ')}]`,
      'draft: false',
    ])}\n\n${body}\n`,
    branch: `contrib/experience-${slug}-${rand}`,
    commitMessage: `Add interview experience: ${company} (${role})`,
    prTitle: `Interview experience: ${company} - ${role}`,
    prBody: `Submitted via the on-site contribution form by **${author}**.\n\n- **Company:** ${company}\n- **Role:** ${role} (${level})\n- **Outcome:** ${outcome}\n\n> Please review for accuracy, tone, and NDA-bound material before merging.`,
  };
}

function prepareTopic(p: Payload, rand: string): PreparedPullRequest {
  const title = requiredText(p.title, 'Topic title', 2, 100);
  const description = requiredText(p.description, 'Description', 20, 240);
  const category = requiredText(p.category, 'Category', 2, 60);
  const overview = requiredText(p.overview, 'Overview', 80, 20000);
  const icon = text(p.icon, 8) || '▚';
  const author = text(p.author, 80) || 'Anonymous';
  const slug = slugify(title, 'topic');

  return {
    kind: 'pull-request',
    path: `src/content/topics/${slug}-${rand}.md`,
    content: `${frontmatter([
      `title: ${yamlStr(title)}`,
      `description: ${yamlStr(description)}`,
      `category: ${yamlStr(category)}`,
      'order: 100',
      `icon: ${yamlStr(icon)}`,
    ])}\n\n${overview}\n`,
    branch: `contrib/topic-${slug}-${rand}`,
    commitMessage: `Add topic: ${title}`,
    prTitle: `New topic: ${title}`,
    prBody: `Submitted via the on-site contribution form by **${author}**.\n\n- **Category:** ${category}\n\n> Please review the scope, study path, and overlap with existing topics before merging.`,
  };
}

function prepareArticle(p: Payload, rand: string): PreparedPullRequest {
  const title = requiredText(p.title, 'Article title', 5, 140);
  const description = requiredText(p.description, 'Description', 20, 240);
  const body = requiredText(p.body, 'Article', 200, 30000);
  const author = text(p.author, 80) || 'Anonymous';
  const tags = parseTags(p.tags);
  const slug = slugify(title, 'article');
  const date = new Date().toISOString().slice(0, 10);

  return {
    kind: 'pull-request',
    path: `src/content/blog/${slug}-${rand}.md`,
    content: `${frontmatter([
      `title: ${yamlStr(title)}`,
      `description: ${yamlStr(description)}`,
      `date: ${date}`,
      `author: ${yamlStr(author)}`,
      `tags: [${tags.map(yamlStr).join(', ')}]`,
      'draft: false',
    ])}\n\n${body}\n`,
    branch: `contrib/article-${slug}-${rand}`,
    commitMessage: `Add article: ${title}`,
    prTitle: `Article: ${title}`,
    prBody: `Submitted via the on-site contribution form by **${author}**.\n\n> Please review technical claims, sources, structure, and editorial fit before merging.`,
  };
}

function prepareCorrection(p: Payload): PreparedIssue {
  const page = requiredText(p.page, 'Page URL or title', 3, 500);
  const problem = requiredText(p.problem, 'Problem description', 20, 4000);
  const correction = requiredText(p.correction, 'Proposed correction', 20, 10000);
  const sources = text(p.sources, 2000);
  const author = text(p.author, 80) || 'Anonymous';
  const shortPage = page.replace(/^https?:\/\//, '').slice(0, 80);

  return {
    kind: 'issue',
    title: `[Content correction] ${shortPage}`,
    body: [
      `Submitted via the on-site contribution form by **${author}**.`,
      '',
      `**Page:** ${page}`,
      '',
      '## What is wrong',
      problem,
      '',
      '## Proposed correction',
      correction,
      ...(sources ? ['', '## Sources', sources] : []),
    ].join('\n'),
  };
}

export const GET: APIRoute = async ({ locals }) => {
  const env = locals.runtime?.env ?? ({} as Env);
  return json({
    githubTokenConfigured: Boolean(env.GITHUB_TOKEN),
    turnstileConfigured: Boolean(env.TURNSTILE_SECRET_KEY),
    runtimeAvailable: Boolean(locals.runtime),
  });
};

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

  if (env.TURNSTILE_SECRET_KEY) {
    const ok = await verifyTurnstile(
      env.TURNSTILE_SECRET_KEY,
      text(p.turnstileToken, 2048) || undefined,
      request.headers.get('CF-Connecting-IP'),
    );
    if (!ok) return json({ error: 'Captcha verification failed. Please try again.' }, 400);
  }

  if (!TYPES.includes(p.type as ContributionType)) {
    return json({ error: 'Choose a valid contribution type.' }, 400);
  }

  try {
    const rand = Math.random().toString(36).slice(2, 8);
    let prepared: PreparedPullRequest | PreparedIssue;

    switch (p.type as ContributionType) {
      case 'question': {
        const topics = await getCollection('topics');
        prepared = prepareQuestion(p, rand, new Set(topics.map((topic) => topic.id)));
        break;
      }
      case 'experience':
        prepared = prepareExperience(p, rand);
        break;
      case 'topic':
        prepared = prepareTopic(p, rand);
        break;
      case 'article':
        prepared = prepareArticle(p, rand);
        break;
      case 'correction':
        prepared = prepareCorrection(p);
        break;
    }

    const cfg = githubConfig(env);
    const result =
      prepared.kind === 'issue'
        ? await openIssue(cfg, prepared)
        : await openFilePullRequest(cfg, prepared);

    return json({ ok: true, url: result.url, number: result.number, kind: prepared.kind });
  } catch (err) {
    if (err instanceof ValidationError) return json({ error: err.message }, 400);
    const status = err instanceof GitHubError ? 502 : 500;
    console.error('Contribution submission failed:', err);
    return json({ error: 'Could not send the contribution. Please try again later.' }, status);
  }
};
