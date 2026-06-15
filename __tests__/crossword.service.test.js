'use strict';

const {
  generateCrossword,
  normalizeAnswer,
  prepareWords,
  placementCrossings,
} = require('../src/services/crossword.service');

describe('crossword.service – normalizeAnswer', () => {
  it('uppercases and strips accents', () => {
    expect(normalizeAnswer('città')).toBe('CITTA');
    expect(normalizeAnswer('perché')).toBe('PERCHE');
  });

  it('removes spaces and punctuation', () => {
    expect(normalizeAnswer("l'albero blu")).toBe('LALBEROBLU');
  });
});

describe('crossword.service – prepareWords', () => {
  it('drops duplicates and out-of-range lengths', () => {
    const out = prepareWords([
      { answer: 'CANE', clue: 'a' },
      { answer: 'CANE', clue: 'b' }, // duplicato
      { answer: 'NO', clue: 'c' }, // troppo corta
      { answer: 'CASA', clue: 'd' },
    ]);
    expect(out.map((w) => w.answer)).toEqual(['CANE', 'CASA']);
  });
});

describe('crossword.service – placementCrossings', () => {
  it('rejects an empty crossing for a non-first word', () => {
    const board = Array.from({ length: 5 }, () => Array(5).fill(null));
    expect(placementCrossings(board, 'CANE', 0, 0, 'across', false)).toBe(-1);
  });

  it('accepts the first word without crossings', () => {
    const board = Array.from({ length: 5 }, () => Array(5).fill(null));
    expect(placementCrossings(board, 'CANE', 0, 0, 'across', true)).toBe(0);
  });
});

describe('crossword.service – generateCrossword', () => {
  let cw;
  beforeAll(() => {
    cw = generateCrossword();
  });

  it('returns a trimmed grid and entries', () => {
    expect(cw.rows).toBeGreaterThan(0);
    expect(cw.cols).toBeGreaterThan(0);
    expect(cw.cells).toHaveLength(cw.rows);
    cw.cells.forEach((row) => expect(row).toHaveLength(cw.cols));
    expect(cw.entries.length).toBeGreaterThanOrEqual(5);
  });

  it('every entry answer matches the letters in the solution grid', () => {
    for (const e of cw.entries) {
      const step = e.direction === 'across' ? [0, 1] : [1, 0];
      let read = '';
      for (let i = 0; i < e.length; i++) {
        const cell = cw.cells[e.row + step[0] * i][e.col + step[1] * i];
        expect(cell).not.toBeNull();
        read += cell.solution;
      }
      expect(read).toBe(e.answer);
    }
  });

  it('every entry starts on a numbered cell', () => {
    for (const e of cw.entries) {
      expect(cw.cells[e.row][e.col].number).toBe(e.number);
      expect(e.number).toBeGreaterThan(0);
    }
  });

  it('every white cell belongs to at least one entry (no orphan letters)', () => {
    const covered = new Set();
    for (const e of cw.entries) {
      const step = e.direction === 'across' ? [0, 1] : [1, 0];
      for (let i = 0; i < e.length; i++) {
        covered.add(`${e.row + step[0] * i},${e.col + step[1] * i}`);
      }
    }
    cw.cells.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell != null) expect(covered.has(`${r},${c}`)).toBe(true);
      })
    );
  });
});
