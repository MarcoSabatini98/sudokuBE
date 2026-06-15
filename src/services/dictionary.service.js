'use strict';

// Dizionario del cruciverba: { word, clue, common } per ogni voce italiana
// definibile (incluse le rare, escluse le forme flesse). Generato offline da
// scripts/build-dictionary.js sul dump di it.wiktionary. Vedi WORDLIST_SOURCE.md.
const ENTRIES = require('../data/crossword-dictionary.json');

const BY_WORD = new Map(ENTRIES.map((e) => [e.word, e]));

/** Tutte le voci del dizionario. */
function allEntries() {
  return ENTRIES;
}

/** Definizione di una parola, o null se assente. */
function clueFor(word) {
  const entry = BY_WORD.get(word);
  return entry ? entry.clue : null;
}

/**
 * Parole raggruppate per lunghezza: Map<number, string[]>.
 * Con `commonOnly` si limita al tier comune (livelli facili).
 */
function wordsByLength({ commonOnly = false } = {}) {
  const byLen = new Map();
  for (const entry of ENTRIES) {
    if (commonOnly && !entry.common) continue;
    const list = byLen.get(entry.word.length) || [];
    list.push(entry.word);
    byLen.set(entry.word.length, list);
  }
  return byLen;
}

module.exports = { allEntries, clueFor, wordsByLength };
