'use strict';

const {
  patternIsValid,
  extractSlots,
  generatePattern,
  runLength,
} = require('../src/services/crossword/pattern');
const { fillSlots, getIndex } = require('../src/services/crossword/fill');

describe('crossword/pattern – runLength & patternIsValid', () => {
  it('measures the white run through a cell', () => {
    const black = [[false, false, false, true]];
    expect(runLength(black, 1, 4, 0, 1, 0, 1)).toBe(3);
  });

  it('rejects 2-letter runs and isolated cells', () => {
    const twoRun = [[false, false, true]]; // run di 2 in alto
    expect(patternIsValid(twoRun, 1, 3)).toBe(false);
    const ok = [[false, false, false]]; // run di 3
    expect(patternIsValid(ok, 1, 3)).toBe(true);
  });
});

describe('crossword/pattern – generatePattern', () => {
  it('produces a valid, 180°-symmetric pattern', () => {
    const rows = 9;
    const cols = 11;
    const black = generatePattern(rows, cols, 0.3);
    expect(patternIsValid(black, rows, cols)).toBe(true);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        expect(black[r][c]).toBe(black[rows - 1 - r][cols - 1 - c]);
      }
    }
  });
});

describe('crossword/pattern – extractSlots + fill', () => {
  it('extracts crossing slots that can be filled from the dictionary', () => {
    // griglia 3x3 tutta bianca: 3 orizzontali + 3 verticali da 3 lettere
    const black = [
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ];
    const slots = extractSlots(black, 3, 3);
    expect(slots).toHaveLength(6);
    const assigned = fillSlots(slots, getIndex(), 4000);
    expect(assigned).not.toBeNull();
    expect(assigned.every((w) => w.length === 3)).toBe(true);
  });
});
