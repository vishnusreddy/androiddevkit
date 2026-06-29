export const SITE = {
  name: 'AndroidDevKit',
  domain: 'androiddevkit.com',
  url: 'https://androiddevkit.com',
  tagline: 'Your one-stop kit for landing the Android job.',
  description:
    'An open-source, community-driven destination for Android developers preparing to switch jobs - curated interview questions, topic-by-topic guides, and real interview experiences.',
  socialImage: '/og-default.png',
  socialImageAlt:
    'AndroidDevKit - open-source interview prep for Android engineers',
  github: 'https://github.com/vishnusreddy/androiddevkit',
  author: 'AndroidDevKit Community',
};

/**
 * Giscus comments config (https://giscus.app).
 *
 * Comments are stored as GitHub Discussions on the repo below. To activate:
 *   1. Enable the "Discussions" feature on the GitHub repo (Settings -> Features).
 *   2. Install the giscus app: https://github.com/apps/giscus (grant it the repo).
 *   3. Visit https://giscus.app, enter the repo, pick the "Comments" category,
 *      and copy the generated `data-repo-id` and `data-category-id` values here.
 *
 * Until `repoId` and `categoryId` are filled in, the <Comments /> component
 * renders nothing, so the site keeps working before setup is finished.
 */
export const GISCUS = {
  repo: 'vishnusreddy/androiddevkit' as `${string}/${string}`,
  repoId: 'R_kgDOTGrOzw',
  category: 'Website Comments',
  categoryId: 'DIC_kwDOTGrOz84DAKTN',
  // 'pathname' gives each page its own discussion thread keyed by URL path.
  mapping: 'pathname',
} as const;

export const NAV = [
  { label: 'Topics', href: '/topics/' },
  { label: 'Questions', href: '/questions/' },
  { label: 'Experiences', href: '/experiences/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Contribute', href: '/contribute/' },
];

export const DIFFICULTY_ORDER = ['junior', 'mid', 'senior'] as const;
export const DIFFICULTY_LABEL: Record<string, string> = {
  junior: 'Junior',
  mid: 'Mid',
  senior: 'Senior',
};
