/**
 * Search matching with a configurable accuracy threshold.
 *
 * A field matches when:
 * 1. it contains the whole query (case-insensitive substring), or
 * 2. every query word is found in it — either as a partial word, or as a word
 *    whose similarity to a field word is >= SEARCH_ACCURACY (Levenshtein).
 *
 * SEARCH_ACCURACY = 1 → exact words only (no typo tolerance). Lower it (e.g.
 * 0.9) to allow approximate matches.
 */

export const SEARCH_ACCURACY = 1;

const levenshtein = (a: string, b: string): number => {
  const cols = b.length + 1;
  let prev = Array.from({ length: cols }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    const curr = [i, ...Array(cols - 1).fill(0)];
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    prev = curr;
  }
  return prev[cols - 1];
};

const similarity = (a: string, b: string): number => {
  const maxLength = Math.max(a.length, b.length);
  if (maxLength === 0) return 1;
  return 1 - levenshtein(a, b) / maxLength;
};

export const matchesSearch = (text: string, query: string): boolean => {
  if (typeof text !== "string") return false;

  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return false;

  if (normalizedText.includes(normalizedQuery)) return true;

  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
  const textWords = normalizedText.split(/[^\p{L}\p{N}]+/u).filter(Boolean);

  return queryWords.every((queryWord) =>
    textWords.some((textWord) => {
      if (textWord.includes(queryWord) || queryWord.includes(textWord)) {
        return true;
      }
      return similarity(queryWord, textWord) >= SEARCH_ACCURACY;
    })
  );
};
