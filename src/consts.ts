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
