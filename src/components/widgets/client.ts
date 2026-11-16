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
