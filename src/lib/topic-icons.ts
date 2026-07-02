const ICON_PATHS: Record<string, string> = {
  kotlin: `
    <path d="M7 5v14"/>
    <path d="m17 5-8 8"/>
    <path d="m11.5 10.5 6.5 8.5"/>
  `,
  'code-snippet-output': `
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/>
    <path d="m7.5 9 3 3-3 3"/>
    <path d="M13.5 15h3"/>
  `,
  coroutines: `
    <path d="M6.2 8.2A7 7 0 0 1 18 7"/>
    <path d="m18 3 .2 4.2L14 7"/>
    <path d="M17.8 15.8A7 7 0 0 1 6 17"/>
    <path d="M6 21 5.8 16.8 10 17"/>
  `,
  'android-fundamentals': `
    <path d="m8 5-2-2"/>
    <path d="m16 5 2-2"/>
    <path d="M6 10a6 6 0 0 1 12 0"/>
    <path d="M5 10h14v7.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z"/>
    <path d="M8.5 14h.01M15.5 14h.01"/>
  `,
  'jetpack-compose': `
    <path d="m12 3 8 4.5-8 4.5-8-4.5Z"/>
    <path d="m4 12 8 4.5 8-4.5"/>
    <path d="m4 16.5 8 4.5 8-4.5"/>
  `,
  architecture: `
    <rect x="9" y="3" width="6" height="5" rx="1"/>
    <rect x="3" y="16" width="6" height="5" rx="1"/>
    <rect x="15" y="16" width="6" height="5" rx="1"/>
    <path d="M12 8v4M6 16v-4h12v4"/>
  `,
  'testing-quality': `
    <path d="M12 3 19 6v5c0 4.8-2.8 8.3-7 10-4.2-1.7-7-5.2-7-10V6Z"/>
    <path d="m8.8 12 2.1 2.1 4.5-4.6"/>
  `,
  'system-design': `
    <rect x="8" y="3" width="8" height="5" rx="1.5"/>
    <rect x="3" y="16" width="7" height="5" rx="1.5"/>
    <rect x="14" y="16" width="7" height="5" rx="1.5"/>
    <path d="M12 8v4M6.5 16v-4h11v4"/>
    <path d="M10.5 5.5h3"/>
  `,
};

const FALLBACK_PATHS = `
  <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v18H6.5A2.5 2.5 0 0 1 4 18.5Z"/>
  <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v18h5.5a2.5 2.5 0 0 0 2.5-2.5Z"/>
`;

export function topicIconSvg(topicId: string): string {
  const paths = ICON_PATHS[topicId] ?? FALLBACK_PATHS;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;
}
