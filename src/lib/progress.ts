/**
 * Client-side interview-prep progress tracker.
 *
 * The site is fully static (no accounts, no backend), so a learner's progress
 * lives in their browser via localStorage. This module is two things in one:
 *
 *   1. A tiny store API (read / write / subscribe) that any page script can import.
 *   2. A self-initializing DOM controller that wires up every progress control
 *      on the page - "mark done" checkboxes, progress bars, and reset buttons -
 *      purely from data attributes, then keeps them in sync on every change
 *      (including changes made in another tab).
 *
 * Because Astro bundles and de-duplicates a given module, importing this file
 * from several components still runs the controller exactly once per page.
 */

const KEY = 'adk:progress:v1';
const EVENT = 'adk:progress-change';

type ProgressMap = Record<string, boolean>;

function read(): ProgressMap {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as ProgressMap) : {};
  } catch {
    return {};
  }
}

function write(map: ProgressMap): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* storage disabled or full - progress just won't persist */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

// ---- Store API -----------------------------------------------------------

export function getDoneSet(): Set<string> {
  const map = read();
  return new Set(Object.keys(map).filter((id) => map[id]));
}

export function isDone(id: string): boolean {
  return read()[id] === true;
}

export function setDone(id: string, done: boolean): void {
  const map = read();
  if (done) map[id] = true;
  else delete map[id];
  write(map);
}

export function clearMany(ids: string[]): void {
  const map = read();
  for (const id of ids) delete map[id];
  write(map);
}

export function clearAll(): void {
  write({});
}

/** Fires whenever progress changes, in this tab or another. Returns an unsubscribe fn. */
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

/** Parse the JSON id list stored on a `[data-progress-ids]` element. */
export function idsOf(el: HTMLElement): string[] {
  try {
    const parsed = JSON.parse(el.dataset.progressIds || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ---- DOM controller ------------------------------------------------------

function paintCheckboxes(done: Set<string>): void {
  document
    .querySelectorAll<HTMLInputElement>('.q-done-input')
    .forEach((cb) => {
      const id = cb.dataset.progressId;
      if (!id) return;
      const isD = done.has(id);
      cb.checked = isD;
      cb.setAttribute('aria-pressed', String(isD));
      cb.closest('.qitem')?.classList.toggle('is-done', isD);
    });
}

function paintBars(done: Set<string>): void {
  document
    .querySelectorAll<HTMLElement>('[data-progress-ids]')
    .forEach((el) => {
      const ids = idsOf(el);
      const total = ids.length;
      const n = ids.reduce((acc, id) => acc + (done.has(id) ? 1 : 0), 0);
      const pct = total ? Math.round((n / total) * 100) : 0;

      const fill = el.querySelector<HTMLElement>('.pt-fill');
      if (fill) fill.style.width = pct + '%';

      el.querySelectorAll<HTMLElement>('[data-progress-count]').forEach(
        (c) => (c.textContent = String(n))
      );
      el.querySelectorAll<HTMLElement>('[data-progress-total]').forEach(
        (c) => (c.textContent = String(total))
      );
      el.querySelectorAll<HTMLElement>('[data-progress-percent]').forEach(
        (c) => (c.textContent = pct + '%')
      );

      el.classList.toggle('is-complete', total > 0 && n === total);
      el.classList.toggle('has-progress', n > 0);

      const bar = el.querySelector<HTMLElement>('.pt-bar');
      if (bar) {
        bar.setAttribute('role', 'progressbar');
        bar.setAttribute('aria-valuemin', '0');
        bar.setAttribute('aria-valuemax', '100');
        bar.setAttribute('aria-valuenow', String(pct));
      }

      el.querySelectorAll<HTMLButtonElement>('.pt-reset').forEach((b) => {
        b.hidden = n === 0;
      });
    });
}

function paint(): void {
  const done = getDoneSet();
  paintCheckboxes(done);
  paintBars(done);
}

function wire(): void {
  // "Mark done" toggles live inside <summary>, so stop clicks from also
  // opening/closing the surrounding <details>.
  document.querySelectorAll<HTMLElement>('.q-done').forEach((label) => {
    if (label.dataset.wired) return;
    label.dataset.wired = '1';
    label.addEventListener('click', (e) => e.stopPropagation());
  });

  document.querySelectorAll<HTMLInputElement>('.q-done-input').forEach((cb) => {
    if (cb.dataset.wired) return;
    cb.dataset.wired = '1';
    cb.addEventListener('change', () => {
      const id = cb.dataset.progressId;
      if (id) setDone(id, cb.checked);
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.pt-reset').forEach((btn) => {
    if (btn.dataset.wired) return;
    btn.dataset.wired = '1';
    btn.addEventListener('click', () => {
      const el = btn.closest<HTMLElement>('[data-progress-ids]');
      if (el) clearMany(idsOf(el));
    });
  });

  document
    .querySelectorAll<HTMLButtonElement>('[data-progress-reset-all]')
    .forEach((btn) => {
      if (btn.dataset.wired) return;
      btn.dataset.wired = '1';
      btn.addEventListener('click', () => {
        if (confirm('Reset all interview-prep progress? This cannot be undone.')) {
          clearAll();
        }
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
