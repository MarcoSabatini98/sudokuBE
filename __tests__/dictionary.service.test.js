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

  it('marks both common and rare tiers', () => {
    const entries = allEntries();
    expect(entries.some((e) => e.common)).toBe(true);
    expect(entries.some((e) => !e.common)).toBe(true);
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

  it('wordsByLength groups words and can restrict to the common tier', () => {
    const all = wordsByLength();
    const common = wordsByLength({ commonOnly: true });
    const count = (m) => [...m.values()].reduce((s, l) => s + l.length, 0);
    expect((all.get(5) || []).length).toBeGreaterThan(10);
    expect(count(common)).toBeLessThan(count(all));
  });
});
