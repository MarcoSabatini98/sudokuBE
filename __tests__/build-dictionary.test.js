'use strict';

const {
  normalizeWord,
  cleanDefinition,
  isOnlyInflectedForm,
  firstDefinition,
  entryFromPage,
  entryFromBlock,
  tierOf,
} = require('../scripts/build-dictionary');

describe('build-dictionary – normalizeWord', () => {
  it('uppercases and strips accents', () => {
    expect(normalizeWord('città')).toBe('CITTA');
  });
  it('rejects proper nouns, multiword and too-short titles', () => {
    expect(normalizeWord('Roma')).toBeNull(); // iniziale maiuscola
    expect(normalizeWord('a cavallo')).toBeNull(); // spazio
    expect(normalizeWord('oh')).toBeNull(); // < 3
  });
});

describe('build-dictionary – cleanDefinition', () => {
  it('unwraps links and domain labels, drops templates', () => {
    expect(cleanDefinition('{{Term|zoologia|it}} [[piccolo]] [[felino]]')).toBe('(zoologia) piccolo felino');
    expect(cleanDefinition("[[animale]] [[domestico]] {{Taxon|Canis}}")).toBe('animale domestico');
  });
});

describe('build-dictionary – isOnlyInflectedForm', () => {
  it('detects form-only sections and spares real lemmas', () => {
    expect(isOnlyInflectedForm('== {{-it-}} ==\n{{-verb form-|it}}\n# gerundio di')).toBe(true);
    expect(isOnlyInflectedForm('== {{-it-}} ==\n{{-sost-|it}}\n# un animale')).toBe(false);
  });
});

describe('build-dictionary – firstDefinition', () => {
  it('takes the first # line, skipping examples and Nodef', () => {
    const section = '{{-sost-|it}}\n# {{Nodef|it}}\n#* esempio\n# vero [[significato]]';
    expect(firstDefinition(section)).toBe('vero significato');
  });
});

describe('build-dictionary – entryFromPage', () => {
  it('builds an entry for an Italian lemma', () => {
    const entry = entryFromPage('cane', '== {{-it-}} ==\n{{-sost-|it}}\n# [[animale]] [[domestico]]');
    expect(entry).toEqual({ word: 'CANE', clue: 'animale domestico' });
  });
  it('returns null for inflected forms', () => {
    const entry = entryFromPage('negozia', '== {{-it-}} ==\n{{-verb form-|it}}\n# terza persona di [[negoziare]]');
    expect(entry).toBeNull();
  });
  it('returns null when there is no Italian section', () => {
    expect(entryFromPage('dog', '== {{-en-}} ==\n{{-noun-|en}}\n# an animal')).toBeNull();
  });
});

describe('build-dictionary – entryFromBlock', () => {
  it('parses a main-namespace page block', () => {
    const block =
      '<page><title>gatto</title><ns>0</ns><revision><text>== {{-it-}} ==\n{{-sost-|it}}\n# [[felino]] [[domestico]]</text></revision>';
    expect(entryFromBlock(block)).toMatchObject({ word: 'GATTO', clue: 'felino domestico' });
  });
  it('ignores non-main namespaces', () => {
    const block = '<page><title>Wikizionario:Bar</title><ns>4</ns><revision><text>ciao</text></revision>';
    expect(entryFromBlock(block)).toBeNull();
  });
});

describe('build-dictionary – tierOf', () => {
  const ranks = new Map([
    ['CANE', 100], // molto frequente → tier 0
    ['SMARGIASSO', 9000], // frequenza media → tier 1
  ]);

  it('maps frequency rank to a difficulty tier', () => {
    expect(tierOf('CANE', ranks)).toBe(0);
    expect(tierOf('SMARGIASSO', ranks)).toBe(1);
    expect(tierOf('LUCULLIANO', ranks)).toBe(2); // assente dalla lista → raro
  });
});
