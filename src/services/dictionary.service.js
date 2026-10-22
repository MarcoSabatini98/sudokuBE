'use strict';

// Dizionario del cruciverba: { word, clue, tier } per ogni voce italiana
// definibile (escluse le forme flesse). tier = difficoltà per frequenza
// (0 facile, 1 medio, 2 raro). Generato offline da scripts/build-dictionary.js
// sul dump di it.wiktionary + lista di frequenza. Vedi WORDLIST_SOURCE.md.
const ENTRIES = require('../data/crossword-dictionary.json');

const BY_WORD = new Map(ENTRIES.map((e) => [e.word, e]));

// Cache opzionale word→clue generata offline con Ollama (scripts/enrich-clues.js).
// Assente per chi non ha Ollama: in quel caso valgono le definizioni del dump.
let CLUE_CACHE = {};
try {
  // fallow-ignore-next-line unresolved-import
  CLUE_CACHE = require('../data/clue-cache.json');
} catch {
  CLUE_CACHE = {};
}

/** Tutte le voci del dizionario. */
function allEntries() {
  return ENTRIES;
}

/** Definizione di una parola: prima la cache arricchita, poi il dump, poi null. */
function clueFor(word) {
  if (CLUE_CACHE[word]) return CLUE_CACHE[word];
  const entry = BY_WORD.get(word);
  return entry ? entry.clue : null;
}

/**
 * Parole raggruppate per lunghezza: Map<number, string[]>.
 * `maxTier` limita al tier di difficoltà (0 = solo facili … 2 = tutte).
 */
function wordsByLength({ maxTier = 2 } = {}) {
  const byLen = new Map();
  for (const entry of ENTRIES) {
    if (entry.tier > maxTier) continue;
    const list = byLen.get(entry.word.length) || [];
    list.push(entry.word);
    byLen.set(entry.word.length, list);
  }
  return byLen;
}

module.exports = { allEntries, clueFor, wordsByLength };
