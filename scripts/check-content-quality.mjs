import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionDir = join(root, 'src/content/questions');
const mcqFile = join(root, 'src/data/practice-mcqs.ts');
const knownTopics = new Set([
  'android-fundamentals',
  'architecture',
  'code-snippet-output',
  'coroutines',
  'jetpack-compose',
  'kotlin',
  'system-design',
  'testing-quality',
]);
const knownDifficulties = new Set(['junior', 'mid', 'senior']);
const failures = [];
const fail = (source, message) => failures.push(`${source}: ${message}`);
const words = (value) => value.match(/[\p{L}\p{N}_]+/gu)?.length ?? 0;

function parseFrontmatter(source, filename) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    fail(filename, 'missing or malformed frontmatter');
    return null;
  }
  const [, raw, body] = match;
  const stringField = (name) => {
    const value = raw.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]?.trim();
    return value?.replace(/^['"]|['"]$/g, '');
  };
  return {
    question: stringField('question'),
    topic: stringField('topic'),
    difficulty: stringField('difficulty'),
    tags: raw.match(/^tags:\s*\[(.*)\]$/m)?.[1],
    body,
  };
}

const seenQuestions = new Map();
const writtenCounts = new Map();
for (const filename of readdirSync(questionDir).filter((name) => name.endsWith('.md')).sort()) {
  const parsed = parseFrontmatter(readFileSync(join(questionDir, filename), 'utf8'), filename);
  if (!parsed) continue;
  const { question, topic, difficulty, tags, body } = parsed;
  if (!question) fail(filename, 'question is required');
  if (question && !/[?.]$/.test(question)) fail(filename, 'question must end with ? or .');
  if (!knownTopics.has(topic)) fail(filename, `unknown topic ${JSON.stringify(topic)}`);
  if (!knownDifficulties.has(difficulty)) fail(filename, `unknown difficulty ${JSON.stringify(difficulty)}`);
  if (!tags?.trim()) fail(filename, 'at least one tag is required');

  const count = words(body);
  if (count < 80) fail(filename, `answer is too thin (${count} words; minimum 80)`);
  if (count > 650) fail(filename, `answer needs editing for focus (${count} words; maximum 650)`);
  if ((body.match(/^```/gm)?.length ?? 0) % 2 !== 0) fail(filename, 'unbalanced fenced code block');
  if (!/(\*\*|^[-*] |^\d+\. |^```|^\|)/m.test(body)) {
    fail(filename, 'answer needs scannable structure (emphasis, list, code, or table)');
  }
  if (/UninitializedPropertyException/.test(body)) {
    fail(filename, 'use the correct exception name: UninitializedPropertyAccessException');
  }

  if (question) {
    const key = question.toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (seenQuestions.has(key)) fail(filename, `duplicates ${seenQuestions.get(key)}`);
    else seenQuestions.set(key, filename);
  }
  writtenCounts.set(topic, (writtenCounts.get(topic) ?? 0) + 1);
}

function extractCalls(source) {
  const calls = [];
  let cursor = 0;
  while ((cursor = source.indexOf('mcq(', cursor)) !== -1) {
    const start = cursor;
    let depth = 0;
    let quote = null;
    let escaped = false;
    let end = -1;
    for (let i = cursor; i < source.length; i += 1) {
      const char = source[i];
      if (quote) {
        if (escaped) escaped = false;
        else if (char === '\\') escaped = true;
        else if (char === quote) quote = null;
        continue;
      }
      if (char === "'" || char === '"' || char === '`') {
        quote = char;
      } else if (char === '(') {
        depth += 1;
      } else if (char === ')') {
        depth -= 1;
        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }
    if (end === -1) throw new Error(`Unclosed mcq() call at offset ${start}`);
    calls.push(source.slice(start, end));
    cursor = end;
  }
  return calls;
}

const mcqSource = readFileSync(mcqFile, 'utf8');
const mcqs = extractCalls(mcqSource).map((call, index) => {
  try {
    return Function('mcq', `"use strict"; return (${call});`)((...args) => args);
  } catch (error) {
    fail(`MCQ ${index + 1}`, `cannot parse: ${error.message}`);
    return null;
  }
}).filter(Boolean);

const seenIds = new Set();
const seenPrompts = new Set();
const mcqCounts = new Map();
for (const args of mcqs) {
  const [id, topic, difficulty, prompt, options, correct, explanation] = args;
  const source = `MCQ ${id ?? '(missing id)'}`;
  if (!/^[a-z]{2}-\d{2}$/.test(id)) fail(source, 'id must look like xx-00');
  if (seenIds.has(id)) fail(source, 'duplicate id');
  seenIds.add(id);
  if (!knownTopics.has(topic)) fail(source, `unknown topic ${JSON.stringify(topic)}`);
  if (!knownDifficulties.has(difficulty)) fail(source, `unknown difficulty ${JSON.stringify(difficulty)}`);
  if (typeof prompt !== 'string' || !prompt.endsWith('?')) fail(source, 'prompt must be a complete question');
  const promptKey = prompt?.toLocaleLowerCase();
  if (seenPrompts.has(promptKey)) fail(source, 'duplicate prompt');
  seenPrompts.add(promptKey);
  if (!Array.isArray(options) || options.length !== 4) fail(source, 'must have exactly four options');
  if (new Set(options).size !== options.length) fail(source, 'options must be unique');
  if (!Number.isInteger(correct) || correct < 0 || correct > 3) fail(source, 'correct index must be 0–3');
  if (typeof explanation !== 'string' || words(explanation) < 18) {
    fail(source, 'explanation must contain at least 18 words and explain the mechanism');
  }
  if (/\bthrows (if|when)\b/i.test(explanation)) {
    fail(source, 'name the exception and the exact failure condition instead of saying only “throws”');
  }
  if (options.some((option) => /^(all|none) of the above$/i.test(option))) {
    fail(source, 'avoid all/none-of-the-above distractors');
  }
  mcqCounts.set(topic, (mcqCounts.get(topic) ?? 0) + 1);
}

for (const topic of knownTopics) {
  if (!writtenCounts.get(topic)) fail('written bank', `topic ${topic} has no questions`);
  if ((mcqCounts.get(topic) ?? 0) < 10) fail('MCQ bank', `topic ${topic} needs at least 10 questions`);
}

if (failures.length) {
  console.error(`Content quality check failed with ${failures.length} issue(s):\n`);
  for (const issue of failures) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`Content quality check passed: ${seenQuestions.size} written questions and ${mcqs.length} MCQs.`);
