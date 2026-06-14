'use strict';

const { generatePuzzle } = require('../src/services/sudoku.service');
const AppError = require('../src/errors/AppError');
const { DIFFICULTY_CONFIG } = require('../src/constants/sudoku.constants');

// fallow-ignore-next-line complexity
function isSolvedSudoku(grid) {
  const expected = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const setsMatch = (arr) => {
    const s = new Set(arr);
    return s.size === 9 && [...expected].every((v) => s.has(v));
  };

  for (let i = 0; i < 9; i++) {
    if (!setsMatch(grid[i])) return false;
    if (!setsMatch(grid.map((r) => r[i]))) return false;
  }
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const box = [];
      for (let r = br * 3; r < br * 3 + 3; r++)
        for (let c = bc * 3; c < bc * 3 + 3; c++)
          box.push(grid[r][c]);
      if (!setsMatch(box)) return false;
    }
  }
  return true;
}

describe('sudoku.service – generatePuzzle', () => {
  it('throws AppError for invalid difficulty', () => {
    expect(() => generatePuzzle('impossible')).toThrow(AppError);
  });

  describe.each(['easy', 'medium', 'hard', 'extreme'])('difficulty: %s', (diff) => {
    let result;

    beforeAll(() => {
      result = generatePuzzle(diff);
    });

    it('returns puzzle and solution', () => {
      expect(result).toHaveProperty('puzzle');
      expect(result).toHaveProperty('solution');
    });

    it('solution is 9×9', () => {
      expect(result.solution).toHaveLength(9);
      result.solution.forEach((row) => expect(row).toHaveLength(9));
    });

    it('puzzle is 9×9', () => {
      expect(result.puzzle).toHaveLength(9);
      result.puzzle.forEach((row) => expect(row).toHaveLength(9));
    });

    it('solution is a valid completed sudoku', () => {
      expect(isSolvedSudoku(result.solution)).toBe(true);
    });

    it('puzzle has correct number of given cells', () => {
      const given = result.puzzle.flat().filter((v) => v !== 0).length;
      const expected = 81 - DIFFICULTY_CONFIG[diff].cellsToRemove;
      expect(given).toBe(expected);
    });

    it('puzzle cells are 0 or match the solution', () => {
      result.puzzle.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val !== 0) expect(val).toBe(result.solution[r][c]);
        });
      });
    });
  });
});
