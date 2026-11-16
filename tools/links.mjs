// Source link checking. Pure apart from the injected fetch, so tests need no network.

export const OK = 'ok';
export const BROKEN = 'broken';
export const UNKNOWN = 'unknown';

/** Maps an HTTP status to a verdict. Only "gone" counts as broken: bots are often blocked (403, 429). */
export function classify(status) {
  if (status >= 200 && status < 400) return OK;
  if (status === 404 || status === 410) return BROKEN;
  return UNKNOWN;
}

/** Reads the YAML frontmatter of an MDX lesson. Returns null when there is none. */
export function frontmatterOf(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(text);
  return match ? match[1] : null;
}

/**
 * Every source URL cited by the lessons, once, with the lessons that cite it.
 * `lessons` is a list of { file, data } where data is the parsed frontmatter.
 * Draft lessons are skipped.
 */
export function collectSources(lessons) {
  const byUrl = new Map();
  for (const { file, data } of lessons) {
    if (data?.draft) continue;
    for (const source of data?.sources ?? []) {
      const entry = byUrl.get(source.url) ?? { url: source.url, files: [] };
      entry.files.push(file);
      byUrl.set(source.url, entry);
    }
  }
  return [...byUrl.values()].sort((a, b) => a.url.localeCompare(b.url));
}

export async function checkLink(link, fetchFn = fetch) {
  let verdict;
  let detail;
  try {
    const response = await fetchFn(link.url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
      headers: { 'user-agent': 'blockchain-explained-link-check' },
    });
    verdict = classify(response.status);
    detail = `HTTP ${response.status}`;
  } catch (error) {
    verdict = UNKNOWN;
    detail = error instanceof Error ? error.message : String(error);
  }
  return { url: link.url, files: link.files, verdict, detail };
}

export function summarise(results) {
  const count = (v) => results.filter((r) => r.verdict === v).length;
  return { ok: count(OK), broken: count(BROKEN), unknown: count(UNKNOWN), total: results.length };
}
