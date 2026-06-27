export const SITE = {
  name: 'AndroidDevKit',
  domain: 'androidevkit.com',
  url: 'https://androidevkit.com',
  tagline: 'Your one-stop kit for landing the Android job.',
  description:
    'An open-source, community-driven destination for Android developers preparing to switch jobs — curated interview questions, topic-by-topic guides, and real interview experiences.',
  // Update once you create the repo.
  github: 'https://github.com/androidevkit/androidevkit',
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
