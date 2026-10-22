'use strict';

const { generateCrossword } = require('../src/services/crossword.service');
const { DIFFICULTY_CONFIG } = require('../src/constants/crossword.constants');

const STEP = { across: [0, 1], down: [1, 0] };

describe('crossword.service – generateCrossword', () => {
  describe.each(['easy', 'medium', 'hard'])('difficulty: %s', (diff) => {
    let cw;
    beforeAll(() => {
      cw = generateCrossword({ difficulty: diff });
    });

    it('matches the configured grid size', () => {
      expect(cw.rows).toBe(DIFFICULTY_CONFIG[diff].rows);
      expect(cw.cols).toBe(DIFFICULTY_CONFIG[diff].cols);
      expect(cw.cells).toHaveLength(cw.rows);
      cw.cells.forEach((row) => expect(row).toHaveLength(cw.cols));
    });

    it('fills every white cell with a single A-Z letter', () => {
      cw.cells.forEach((row) =>
        row.forEach((cell) => {
          if (cell) expect(cell.solution).toMatch(/^[A-Z]$/);
        })
      );
    });

    it('every entry reads back its answer, is numbered and has a clue', () => {
      for (const e of cw.entries) {
        const [dr, dc] = STEP[e.direction];
        let read = '';
        for (let i = 0; i < e.length; i++) {
          const cell = cw.cells[e.row + dr * i][e.col + dc * i];
          expect(cell).not.toBeNull();
          read += cell.solution;
        }
        expect(read).toBe(e.answer);
        expect(e.number).toBeGreaterThan(0);
        expect(e.clue.length).toBeGreaterThan(0);
      }
    });

    it('every white cell belongs to at least one entry', () => {
      const covered = new Set();
      for (const e of cw.entries) {
        const [dr, dc] = STEP[e.direction];
        for (let i = 0; i < e.length; i++) covered.add(`${e.row + dr * i},${e.col + dc * i}`);
      }
      cw.cells.forEach((row, r) =>
        row.forEach((cell, c) => {
          if (cell) expect(covered.has(`${r},${c}`)).toBe(true);
        })
      );
    });
  });

  it('falls back to medium for an unknown difficulty', () => {
    const cw = generateCrossword({ difficulty: 'nope' });
    expect(cw.rows).toBe(DIFFICULTY_CONFIG.medium.rows);
  });
});
