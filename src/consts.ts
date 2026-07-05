export const SITE = {
  name: 'AndroidDevKit',
  domain: 'androiddevkit.com',
  url: 'https://androiddevkit.com',
  tagline: 'Focused Android interview prep, built by the community.',
  description:
    'A free, community-driven Android interview preparation resource with curated questions, topic guides, practice sessions, and real interview experiences.',
  // Version the default image URL so social crawlers fetch a fresh preview after changes.
  socialImage: '/og-default.png?v=20260705',
  socialImageAlt:
    'AndroidDevKit - open-source interview prep for Android engineers',
  github: 'https://github.com/vishnusreddy/androiddevkit',
  reddit: 'https://www.reddit.com/r/AndroidDevKit/',
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

export type NavLink = {
  label: string;
  href: string;
  /** Short description shown in the header dropdown menus. */
  desc?: string;
};

export type NavGroup =
  | (NavLink & { items?: undefined })
  | { label: string; href?: undefined; items: NavLink[] };

/**
 * Grouped navigation is the source of truth for the header. Related
 * destinations live under a single dropdown so the top bar stays lean as the
 * site grows. To add a new section (e.g. "Practice"), drop it into the right
 * group's `items` array - the header, mobile menu, and footer all derive from
 * this list automatically.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Learn',
    items: [
      { label: 'Topics', href: '/topics/', desc: 'Concept guides, topic by topic' },
      { label: 'Questions', href: '/questions/', desc: 'Curated interview questions' },
    ],
  },
  { label: 'Practice', href: '/practice/' },
  { label: 'Progress', href: '/progress/' },
  {
    label: 'Community',
    items: [
      { label: 'Experiences', href: '/experiences/', desc: 'Real interview stories' },
      { label: 'Blog', href: '/blog/', desc: 'Articles & deep dives' },
      { label: 'Contribute', href: '/contribute/', desc: 'Add a question or share yours' },
    ],
  },
];

/** Flat list (footer, mobile fallback), derived from NAV_GROUPS. */
export const NAV: NavLink[] = NAV_GROUPS.flatMap((g) =>
  g.items ? g.items : [{ label: g.label, href: g.href }],
);

export const DIFFICULTY_ORDER = ['junior', 'mid', 'senior'] as const;
export const DIFFICULTY_LABEL: Record<string, string> = {
  junior: 'Junior',
  mid: 'Mid',
  senior: 'Senior',
};
