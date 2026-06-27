/**
 * Tiny GitHub REST helper used by the experience-submission endpoint.
 *
 * It opens a pull request that adds a single Markdown file, using only
 * `fetch` so we avoid pulling Octokit into the Worker bundle. The flow is:
 *   1. read the base branch's head commit SHA
 *   2. create a new branch off it
 *   3. commit the file onto that branch
 *   4. open a PR from the branch into the base
 */

const API = 'https://api.github.com';

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  baseBranch: string;
}

interface NewFilePR {
  /** Repo-relative path, e.g. "src/content/experiences/acme-android.md". */
  path: string;
  /** Raw file contents (UTF-8). */
  content: string;
  branch: string;
  commitMessage: string;
  prTitle: string;
  prBody: string;
}

class GitHubError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'GitHubError';
  }
}

async function gh(cfg: GitHubConfig, path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'androiddevkit-contrib-bot',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    let detail = '';
    try {
      const data = (await res.json()) as { message?: string };
      detail = data?.message ?? '';
    } catch {
      // body wasn't JSON; ignore
    }
    throw new GitHubError(
      `GitHub ${init?.method ?? 'GET'} ${path} failed (${res.status})${detail ? `: ${detail}` : ''}`,
      res.status,
    );
  }
  return res.json();
}

/** UTF-8 safe base64 encoding (Worker runtime has btoa but not Buffer). */
function toBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

/**
 * Creates a branch, commits a single new file, and opens a PR.
 * Returns the PR's html_url and number.
 */
export async function openFilePullRequest(
  cfg: GitHubConfig,
  pr: NewFilePR,
): Promise<{ url: string; number: number }> {
  const base = `/repos/${cfg.owner}/${cfg.repo}`;

  // 1. base branch head SHA
  const ref = (await gh(cfg, `${base}/git/ref/heads/${cfg.baseBranch}`)) as {
    object: { sha: string };
  };
  const baseSha = ref.object.sha;

  // 2. create the new branch
  await gh(cfg, `${base}/git/refs`, {
    method: 'POST',
    body: JSON.stringify({ ref: `refs/heads/${pr.branch}`, sha: baseSha }),
  });

  // 3. commit the file onto the branch
  await gh(cfg, `${base}/contents/${pr.path}`, {
    method: 'PUT',
    body: JSON.stringify({
      message: pr.commitMessage,
      content: toBase64(pr.content),
      branch: pr.branch,
    }),
  });

  // 4. open the PR
  const created = (await gh(cfg, `${base}/pulls`, {
    method: 'POST',
    body: JSON.stringify({
      title: pr.prTitle,
      head: pr.branch,
      base: cfg.baseBranch,
      body: pr.prBody,
    }),
  })) as { html_url: string; number: number };

  return { url: created.html_url, number: created.number };
}

export { GitHubError };
