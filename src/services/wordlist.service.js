'use strict';

// Wordlist italiana (parole comuni, A-Z maiuscole). Vedi src/data/WORDLIST_SOURCE.md.
const WORDS = require('../data/wordlist-it.json');

/** Tutte le parole della wordlist. */
function loadWordlist() {
  return WORDS;
}

/** Parole raggruppate per lunghezza: Map<number, string[]>. */
function wordsByLength() {
  const byLen = new Map();
  for (const word of WORDS) {
    const list = byLen.get(word.length) || [];
    list.push(word);
    byLen.set(word.length, list);
  }
  return byLen;
}

module.exports = { loadWordlist, wordsByLength };
