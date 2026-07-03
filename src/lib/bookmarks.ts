/**
 * Client-side "save for review" bookmarks.
 *
 * The night-before-the-interview workflow: while studying, flag the questions
 * you struggled with, then revisit just those. Same architecture as
 * `progress.ts` - a localStorage-backed store plus a self-initializing DOM
 * controller wired purely from data attributes, deduplicated by the bundler
 * so it runs once per page.
 */

const KEY = 'adk:bookmarks:v1';
const EVENT = 'adk:bookmarks-change';

type BookmarkMap = Record<string, boolean>;

function read(): BookmarkMap {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as BookmarkMap) : {};
  } catch {
    return {};
  }
}

function write(map: BookmarkMap): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* storage disabled or full - bookmarks just won't persist */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

// ---- Store API -----------------------------------------------------------

export function getSavedSet(): Set<string> {
  const map = read();
  return new Set(Object.keys(map).filter((id) => map[id]));
}

export function isSaved(id: string): boolean {
  return read()[id] === true;
}

export function setSaved(id: string, saved: boolean): void {
  const map = read();
  if (saved) map[id] = true;
  else delete map[id];
  write(map);
}

/** Fires whenever bookmarks change, in this tab or another. Returns an unsubscribe fn. */
export function onChange(cb: () => void): () => void {
  const local = () => cb();
  const cross = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener(EVENT, local);
  window.addEventListener('storage', cross);
  return () => {
    window.removeEventListener(EVENT, local);
    window.removeEventListener('storage', cross);
  };
}

// ---- DOM controller ------------------------------------------------------

function paint(): void {
  const saved = getSavedSet();

  document
    .querySelectorAll<HTMLButtonElement>('[data-bookmark-id]')
    .forEach((btn) => {
      const id = btn.dataset.bookmarkId;
      if (!id) return;
      const on = saved.has(id);
      btn.classList.toggle('is-saved', on);
      btn.setAttribute('aria-pressed', String(on));
    });

  document
    .querySelectorAll<HTMLElement>('[data-bookmark-count]')
    .forEach((el) => (el.textContent = String(saved.size)));
}

function wire(): void {
  document
    .querySelectorAll<HTMLButtonElement>('[data-bookmark-id]')
    .forEach((btn) => {
      if (btn.dataset.wired) return;
      btn.dataset.wired = '1';
      btn.addEventListener('click', (e) => {
        // Bookmark buttons live inside <summary>; don't toggle the <details>.
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.bookmarkId;
        if (id) setSaved(id, !isSaved(id));
      });
    });
}

function init(): void {
  wire();
  paint();
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  window.addEventListener(EVENT, paint);
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) paint();
  });
}
