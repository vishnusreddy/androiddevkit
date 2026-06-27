import { getCollection } from 'astro:content';

// Static JSON search index, built at build time and fetched lazily by the
// global search overlay (see src/components/SearchBar.astro). The whole corpus
// is small (a few hundred short entries), so a single client-side index keeps
// search instant with zero runtime/server dependencies.
export const prerender = true;

/** Strip markdown to plain, searchable text and cap length to keep the index lean. */
function strip(md = '') {
  return md
    .replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
    .replace(/`[^`]*`/g, ' ') // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> link text
    .replace(/^[ \t]*[-*+>#]+/gm, ' ') // list/quote/heading markers
    .replace(/[*_~`]/g, ' ') // leftover emphasis chars
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1200);
}

export async function GET() {
  const [topics, questions, experiences, blog] = await Promise.all([
    getCollection('topics'),
    getCollection('questions'),
    getCollection('experiences'),
    getCollection('blog'),
  ]);

  const topicTitle = new Map(topics.map((t) => [t.id, t.data.title]));
  const records = [];

  for (const t of topics) {
    records.push({
      type: 'topic',
      title: t.data.title,
      url: `/topics/${t.id}/`,
      meta: t.data.category,
      tags: [],
      body: `${t.data.description} ${strip(t.body)}`,
    });
  }

  for (const q of questions) {
    const topicId = q.data.topic.id;
    records.push({
      type: 'question',
      title: q.data.question,
      url: `/questions/#${q.id}`,
      meta: topicTitle.get(topicId) ?? topicId,
      tags: q.data.tags ?? [],
      body: strip(q.body),
    });
  }

  // Experiences power two result types: the interview write-up itself, and a
  // deduplicated "company" entry so a search like "Google" surfaces the company.
  const published = experiences.filter((e) => !e.data.draft);
  const byCompany = new Map();

  for (const e of published) {
    records.push({
      type: 'interview',
      title: `${e.data.company} - ${e.data.role}`,
      url: `/experiences/${e.id}/`,
      meta: [e.data.level, e.data.location, e.data.outcome].filter(Boolean).join(' · '),
      tags: e.data.tags ?? [],
      body: strip(e.body),
    });

    const list = byCompany.get(e.data.company) ?? [];
    list.push(e);
    byCompany.set(e.data.company, list);
  }

  for (const [company, list] of byCompany) {
    const count = list.length;
    records.push({
      type: 'company',
      title: company,
      url: count === 1 ? `/experiences/${list[0].id}/` : '/experiences/',
      meta: `${count} interview ${count === 1 ? 'experience' : 'experiences'}`,
      tags: [...new Set(list.flatMap((e) => e.data.tags ?? []))],
      body: list.map((e) => `${e.data.role} ${e.data.level} ${e.data.location ?? ''}`).join(' '),
    });
  }

  for (const b of blog) {
    if (b.data.draft) continue;
    records.push({
      type: 'blog',
      title: b.data.title,
      url: `/blog/${b.id}/`,
      meta: 'Blog',
      tags: b.data.tags ?? [],
      body: `${b.data.description} ${strip(b.body)}`,
    });
  }

  return new Response(JSON.stringify(records), {
    headers: { 'Content-Type': 'application/json' },
  });
}
