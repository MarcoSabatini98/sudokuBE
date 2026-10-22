'use strict';

// Cache arricchita (Ollama) simulata: clueFor deve preferirla al dump.
jest.mock('../src/data/clue-cache.json', () => ({ GATTO: 'Felino di casa che caccia i topi' }), {
  virtual: true,
});

const { allEntries, clueFor, wordsByLength } = require('../src/services/dictionary.service');

describe('dictionary.service', () => {
  it('loads a rich dictionary of entries with clues', () => {
    const entries = allEntries();
    expect(entries.length).toBeGreaterThan(10000);
    expect(entries.every((e) => /^[A-Z]+$/.test(e.word) && typeof e.clue === 'string')).toBe(true);
  });

  it('assigns a difficulty tier (0..2) to every entry, with all tiers present', () => {
    const entries = allEntries();
    expect(entries.every((e) => [0, 1, 2].includes(e.tier))).toBe(true);
    expect(entries.some((e) => e.tier === 0)).toBe(true);
    expect(entries.some((e) => e.tier === 1)).toBe(true);
    expect(entries.some((e) => e.tier === 2)).toBe(true);
  });

  it('clueFor returns a definition for a known word, null otherwise', () => {
    expect(clueFor('CANE')).toMatch(/animale|mammif/i);
    expect(clueFor('XQZWK')).toBeNull();
  });

  it('clueFor prefers the enriched clue cache when present', () => {
    expect(clueFor('GATTO')).toBe('Felino di casa che caccia i topi');
  });

  it('does not include inflected verb forms', () => {
    expect(clueFor('NEGOZIA')).toBeNull();
    expect(clueFor('ODIANDO')).toBeNull();
  });

  it('wordsByLength groups words and can restrict to a difficulty tier', () => {
    const all = wordsByLength();
    const easy = wordsByLength({ maxTier: 0 });
    const medium = wordsByLength({ maxTier: 1 });
    const count = (m) => [...m.values()].reduce((s, l) => s + l.length, 0);
    expect((all.get(5) || []).length).toBeGreaterThan(10);
    expect(count(easy)).toBeLessThan(count(medium));
    expect(count(medium)).toBeLessThan(count(all));
  });
});
