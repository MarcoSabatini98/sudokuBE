'use strict';

const { DIFFICULTY_CONFIG } = require('../constants/sudoku.constants');
const AppError = require('../errors/AppError');

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isValid(grid, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num) return false;
    if (grid[i][col] === num) return false;
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (grid[r][c] === num) return false;
    }
  }
  return true;
}

function fillGrid(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] !== 0) continue;
      const candidates = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      for (const num of candidates) {
        if (isValid(grid, row, col, num)) {
          grid[row][col] = num;
          if (fillGrid(grid)) return true;
          grid[row][col] = 0;
        }
      }
      return false;
    }
  }
  return true;
}

function countSolutions(grid, counter = { value: 0 }) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] !== 0) continue;
      for (let num = 1; num <= 9; num++) {
        if (isValid(grid, row, col, num)) {
          grid[row][col] = num;
          countSolutions(grid, counter);
          grid[row][col] = 0;
          if (counter.value > 1) return counter.value;
        }
      }
      return counter.value;
    }
  }
  counter.value++;
  return counter.value;
}

function generatePuzzle(difficulty) {
  const config = DIFFICULTY_CONFIG[difficulty];
  if (!config) throw new AppError(`Difficoltà non valida: ${difficulty}`, 400);

  const solution = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillGrid(solution);

  const puzzle = solution.map((row) => [...row]);

  const positions = shuffleArray(
    Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9])
  );

  let removed = 0;
  for (const [row, col] of positions) {
    if (removed >= config.cellsToRemove) break;

    const backup = puzzle[row][col];
    puzzle[row][col] = 0;

    const gridCopy = puzzle.map((r) => [...r]);
    if (countSolutions(gridCopy) === 1) {
      removed++;
    } else {
      puzzle[row][col] = backup;
    }
  }

  return { puzzle, solution };
}

module.exports = { generatePuzzle };
