'use strict';

const { loadWordlist, wordsByLength } = require('../src/services/wordlist.service');

describe('wordlist.service', () => {
  it('loads a non-empty list of clean uppercase A-Z words', () => {
    const words = loadWordlist();
    expect(words.length).toBeGreaterThan(500);
    expect(words.every((w) => /^[A-Z]+$/.test(w))).toBe(true);
  });

  it('words are within the expected length range and unique', () => {
    const words = loadWordlist();
    expect(words.every((w) => w.length >= 3 && w.length <= 12)).toBe(true);
    expect(new Set(words).size).toBe(words.length);
  });

  it('groups words by length', () => {
    const byLen = wordsByLength();
    const total = [...byLen.values()].reduce((sum, list) => sum + list.length, 0);
    expect(total).toBe(loadWordlist().length);
    expect((byLen.get(4) || []).length).toBeGreaterThan(10);
  });
});
