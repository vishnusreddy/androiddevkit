export interface MockTest {
  /** Slug used in the URL (`/practice/?test=<id>`) and localStorage keys. */
  id: string;
  title: string;
  /** One crisp sentence naming what the test actually covers. */
  description: string;
  /** Topic id from the topics collection, or 'all'. */
  topic: string;
  format: 'mcq' | 'written' | 'mixed';
  difficulty: 'all' | 'junior' | 'mid' | 'senior';
  /** Advertised question count. Clamped at render time to the real pool. */
  length: number;
  /** Duration in seconds. 0 means untimed. */
  duration: number;
  /** Maps to the practice engine's `test` field filter (e.g. 'kotlin-dsa'). */
  preset?: string;
  kind: 'topic' | 'full' | 'sprint' | 'dsa' | 'interview';
}

export const MOCK_TESTS: MockTest[] = [
  // ---- Full mock interviews (all topics) ----
  {
    id: 'junior-full-mock',
    title: 'Junior Full Mock',
    description:
      'Fifteen junior-level questions spanning Kotlin basics, the activity lifecycle, and everyday Android framework work.',
    topic: 'all',
    format: 'mixed',
    difficulty: 'junior',
    length: 15,
    duration: 1200,
    kind: 'full',
  },
  {
    id: 'mid-full-mock',
    title: 'Mid-Level Full Mock',
    description:
      'Fifteen mid-level questions on architecture choices, coroutine scoping, and Compose state that a two-to-four-year engineer should own.',
    topic: 'all',
    format: 'mixed',
    difficulty: 'mid',
    length: 15,
    duration: 1200,
    kind: 'full',
  },
  {
    id: 'senior-full-mock',
    title: 'Senior Full Mock',
    description:
      'Fifteen senior-level questions on system design trade-offs, concurrency edge cases, and testable architecture under a tighter clock.',
    topic: 'all',
    format: 'mixed',
    difficulty: 'senior',
    length: 15,
    duration: 1500,
    kind: 'full',
  },
  {
    id: 'rapid-fire',
    title: 'Rapid Fire',
    description:
      'Ten multiple-choice questions drawn from every topic, timed short to build recall speed before a screen.',
    topic: 'all',
    format: 'mcq',
    difficulty: 'all',
    length: 10,
    duration: 480,
    kind: 'sprint',
  },
  {
    id: 'kotlin-dsa-sprint',
    title: 'Kotlin DSA Sprint',
    description:
      'Ten output-tracing and small-code Kotlin prompts, no Android framework trivia, mirroring a live coding screen.',
    topic: 'kotlin',
    format: 'mixed',
    difficulty: 'all',
    length: 10,
    duration: 600,
    preset: 'kotlin-dsa',
    kind: 'sprint',
  },

  // ---- Mock interviews (written answers, self-graded) ----
  {
    id: 'screening-interview',
    title: 'Android Screening Interview',
    description:
      'Six spoken-style questions across the stack, the kind a first-round screen opens with. Answer in your own words, then grade yourself against the reference.',
    topic: 'all',
    format: 'written',
    difficulty: 'all',
    length: 6,
    duration: 1800,
    kind: 'interview',
  },
  {
    id: 'senior-android-interview',
    title: 'Senior Android Interview',
    description:
      'Six senior-level questions on concurrency, architecture trade-offs, and production failures, where the follow-up is always "why".',
    topic: 'all',
    format: 'written',
    difficulty: 'senior',
    length: 6,
    duration: 2100,
    kind: 'interview',
  },
  {
    id: 'system-design-interview',
    title: 'Mobile System Design Interview',
    description:
      'Four design prompts on sync, caching, pagination, and resilience. Talk through trade-offs the way you would at a whiteboard.',
    topic: 'system-design',
    format: 'written',
    difficulty: 'all',
    length: 4,
    duration: 2100,
    kind: 'interview',
  },

  // ---- DSA rounds (two coding questions, ten minutes each) ----
  {
    id: 'dsa-round-1',
    title: 'DSA Round 1: Arrays & Hashing',
    description:
      'Pair with target sum and first unique character. The two warm-up problems Android screens open with, in real Kotlin.',
    topic: 'all',
    format: 'written',
    difficulty: 'all',
    length: 2,
    duration: 1200,
    preset: 'dsa-round-1',
    kind: 'dsa',
  },
  {
    id: 'dsa-round-2',
    title: 'DSA Round 2: Arrays In Place',
    description:
      'Move zeroes without losing order, then maximum subarray sum. Write pointers and Kadane, the follow-up interviewers love.',
    topic: 'all',
    format: 'written',
    difficulty: 'all',
    length: 2,
    duration: 1200,
    preset: 'dsa-round-2',
    kind: 'dsa',
  },
  {
    id: 'dsa-round-3',
    title: 'DSA Round 3: Stacks & Windows',
    description:
      'Valid parentheses with a stack, then longest substring without repeating characters with a sliding window.',
    topic: 'all',
    format: 'written',
    difficulty: 'all',
    length: 2,
    duration: 1200,
    preset: 'dsa-round-3',
    kind: 'dsa',
  },

  // ---- Topic-wise tests (one per topic, MCQ, 10Q / 12 min) ----
  {
    id: 'android-fundamentals-test',
    title: 'Android Fundamentals Mock Test',
    description:
      'Activity and fragment lifecycle, the manifest, intents, background execution limits, and process death recovery.',
    topic: 'android-fundamentals',
    format: 'mcq',
    difficulty: 'all',
    length: 10,
    duration: 720,
    kind: 'topic',
  },
  {
    id: 'architecture-test',
    title: 'Architecture & Patterns Mock Test',
    description:
      'MVVM versus MVI, the repository pattern, dependency injection, unidirectional data flow, and where state should live.',
    topic: 'architecture',
    format: 'mcq',
    difficulty: 'all',
    length: 10,
    duration: 720,
    kind: 'topic',
  },
  {
    id: 'coroutines-test',
    title: 'Coroutines & Flow Mock Test',
    description:
      'Structured concurrency, dispatchers, cancellation, supervisor scopes, and the difference between cold Flow and hot state.',
    topic: 'coroutines',
    format: 'mcq',
    difficulty: 'all',
    length: 10,
    duration: 720,
    kind: 'topic',
  },
  {
    id: 'jetpack-compose-test',
    title: 'Jetpack Compose Mock Test',
    description:
      'Recomposition, state hoisting, remember and derivedStateOf, side-effect APIs, and reading the three composition phases.',
    topic: 'jetpack-compose',
    format: 'mcq',
    difficulty: 'all',
    length: 10,
    duration: 720,
    kind: 'topic',
  },
  {
    id: 'kotlin-test',
    title: 'Kotlin Language Mock Test',
    description:
      'Null safety, scope functions, data and sealed classes, delegation, inline and reified generics, and collection operators.',
    topic: 'kotlin',
    format: 'mcq',
    difficulty: 'all',
    length: 10,
    duration: 720,
    kind: 'topic',
  },
  {
    id: 'system-design-test',
    title: 'Mobile System Design Mock Test',
    description:
      'Offline-first sync, pagination, caching layers, image loading, and designing a client that survives a flaky network.',
    topic: 'system-design',
    format: 'mcq',
    difficulty: 'all',
    length: 10,
    duration: 720,
    kind: 'topic',
  },
  {
    id: 'testing-quality-test',
    title: 'Testing & Quality Mock Test',
    description:
      'Unit versus instrumented tests, fakes over mocks, testing coroutines and Flow, and keeping a suite fast and deterministic.',
    topic: 'testing-quality',
    format: 'mcq',
    difficulty: 'all',
    length: 10,
    duration: 720,
    kind: 'topic',
  },
  {
    id: 'code-snippet-output-test',
    title: 'Code Snippet Output Mock Test',
    description:
      'Read short Kotlin and Android snippets and predict the exact output, ordering, or thrown exception.',
    topic: 'code-snippet-output',
    format: 'mcq',
    difficulty: 'all',
    length: 10,
    duration: 720,
    kind: 'topic',
  },
];
