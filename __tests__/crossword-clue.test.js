'use strict';

const { shortenClue } = require('../src/services/crossword/clue');

describe('crossword/clue – shortenClue', () => {
  it('leaves short clues and full mode (maxLen 0) untouched', () => {
    expect(shortenClue('animale domestico', 70)).toBe('animale domestico');
    const long = 'a'.repeat(200);
    expect(shortenClue(long, 0)).toBe(long);
  });

  it('cuts at a natural boundary without ellipsis', () => {
    const clue = '(zoologia) alato dell’ordine degli Imenotteri; produce il miele e la cera';
    const out = shortenClue(clue, 45);
    expect(out.length).toBeLessThanOrEqual(45);
    expect(out).not.toContain('…');
    expect(clue.startsWith(out)).toBe(true);
  });

  it('falls back to the last space when there is no punctuation', () => {
    const clue = 'parolalunga senza alcuna punteggiatura interna affatto';
    const out = shortenClue(clue, 30);
    expect(out.length).toBeLessThanOrEqual(30);
    expect(out.endsWith(' ')).toBe(false);
  });
});
