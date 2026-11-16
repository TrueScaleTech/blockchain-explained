// Small helpers shared by the widget scripts (browser only).

export { fill } from '../../widget-strings';

/** Every instance of a widget on the page, with its strings. */
export function widgets<T>(name: string): { root: HTMLElement; s: T }[] {
  return [...document.querySelectorAll<HTMLElement>(`[data-widget="${name}"]`)].map((root) => ({
    root,
    s: JSON.parse(root.dataset.strings ?? '{}') as T,
  }));
}

/** Shows the controls that need a script and removes the "needs JavaScript" note. */
export function goLive(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('.live').forEach((el) => (el.hidden = false));
  root.querySelector('.noscript')?.remove();
}

/** A required element; a missing one is a bug in the widget's markup, so fail loudly. */
export function $<E extends Element = HTMLElement>(root: ParentNode, selector: string): E {
  const el = root.querySelector<E>(selector);
  if (!el) throw new Error(`widget markup is missing ${selector}`);
  return el;
}

export function numberFormat(options?: Intl.NumberFormatOptions): Intl.NumberFormat {
  return new Intl.NumberFormat(document.documentElement.lang || 'en', options);
}

/**
 * Writes a hex string into an element, wrapping chosen character positions in <mark>.
 * Built from text nodes, never from HTML strings.
 */
export function writeMarked(el: HTMLElement, text: string, marked: (i: number) => boolean): void {
  el.replaceChildren();
  let run = '';
  let runMarked = false;
  const flush = () => {
    if (!run) return;
    if (runMarked) {
      const mark = document.createElement('mark');
      mark.textContent = run;
      el.append(mark);
    } else {
      el.append(run);
    }
    run = '';
  };
  for (let i = 0; i < text.length; i++) {
    const m = marked(i);
    if (m !== runMarked) {
      flush();
      runMarked = m;
    }
    run += text[i];
  }
  flush();
}

/** Keeps only the latest of several overlapping async updates. */
export function latest() {
  let ticket = 0;
  return {
    next: () => ++ticket,
    isCurrent: (t: number) => t === ticket,
  };
}

/** True when the reader asked the system for less motion: every effect below is then skipped. */
export function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const HEX = '0123456789abcdef';
export function randomHex(length: number): string {
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => HEX[b & 15]).join('');
}

const running = new WeakMap<HTMLElement, number>();

/**
 * Writes a hash into an element the way a decoder settles: the digits scramble, then lock into
 * place from left to right. `done` runs once the final text is in (use it to mark changed digits).
 * With reduced motion the text is written at once. A newer call on the same element cancels the
 * older one.
 */
export function resolveText(el: HTMLElement, text: string, done?: () => void): void {
  const previous = running.get(el);
  if (previous !== undefined) cancelAnimationFrame(previous);
  if (reducedMotion()) {
    el.textContent = text;
    done?.();
    return;
  }
  const scramble = 140;
  const perChar = 5;
  const start = performance.now();
  const frame = (now: number) => {
    const t = now - start;
    let out = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i]!;
      out +=
        !/[0-9a-f]/i.test(ch) || t >= scramble + perChar * i ? ch : HEX[(Math.random() * 16) | 0];
    }
    el.textContent = out;
    if (t < scramble + perChar * text.length) {
      running.set(el, requestAnimationFrame(frame));
    } else {
      running.delete(el);
      el.textContent = text;
      done?.();
    }
  };
  running.set(el, requestAnimationFrame(frame));
}

/** Runs `show` once, the first time the element is on screen (at once without IntersectionObserver). */
export function whenVisible(el: Element, show: () => void): void {
  if (!('IntersectionObserver' in window) || reducedMotion()) {
    show();
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      show();
    }
  });
  observer.observe(el);
}
