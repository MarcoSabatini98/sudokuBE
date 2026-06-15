'use strict';

const {
  DIFFICULTY_CONFIG,
  MAX_PATTERN_ATTEMPTS,
  MAX_FILL_STEPS,
} = require('../constants/crossword.constants');
const { generatePattern, extractSlots } = require('./crossword/pattern');
const { getIndex, fillSlots } = require('./crossword/fill');
const { clueFor } = require('./dictionary.service');

/** Griglia di lettere iniziale: null = casella nera, '' = bianca da riempire. */
function blankGrid(black, rows, cols) {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => (black[r][c] ? null : ''))
  );
}

/** Scrive nella griglia le parole assegnate a ciascuno slot. */
function placeWords(letterGrid, slots, assigned) {
  slots.forEach((slot, si) => {
    slot.cells.forEach(([r, c], i) => {
      letterGrid[r][c] = assigned[si][i];
    });
  });
}

/** Numera le caselle (inizio di una parola) e costruisce la griglia di output. */
function numberCells(letterGrid, rows, cols) {
  const filled = (r, c) => r >= 0 && c >= 0 && r < rows && c < cols && letterGrid[r][c] !== null;
  const cells = letterGrid.map((row) => row.map(() => null));
  const numberAt = new Map();
  let next = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (letterGrid[r][c] === null) continue;
      const startsAcross = !filled(r, c - 1) && filled(r, c + 1);
      const startsDown = !filled(r - 1, c) && filled(r + 1, c);
      let number = null;
      if (startsAcross || startsDown) {
        number = next++;
        numberAt.set(`${r},${c}`, number);
      }
      cells[r][c] = { solution: letterGrid[r][c], number };
    }
  }
  return { cells, numberAt };
}

function buildEntries(slots, letterGrid, numberAt) {
  return slots
    .map((slot) => {
      const answer = slot.cells.map(([r, c]) => letterGrid[r][c]).join('');
      return {
        number: numberAt.get(`${slot.row},${slot.col}`) || null,
        direction: slot.dir,
        row: slot.row,
        col: slot.col,
        length: slot.len,
        clue: clueFor(answer) || '',
        answer,
      };
    })
    .sort((a, b) => a.number - b.number || a.direction.localeCompare(b.direction));
}

/**
 * Genera un cruciverba denso per la difficoltà data: prova vari pattern simmetrici
 * finché uno si riempie completamente dal dizionario.
 */
function generateCrossword({ difficulty = 'medium' } = {}) {
  const cfg = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const index = getIndex();

  for (let attempt = 0; attempt < MAX_PATTERN_ATTEMPTS; attempt++) {
    const black = generatePattern(cfg.rows, cfg.cols, cfg.blackRatio);
    const slots = extractSlots(black, cfg.rows, cfg.cols);
    if (slots.length === 0) continue;

    const assigned = fillSlots(slots, index, MAX_FILL_STEPS);
    if (assigned) {
      const letterGrid = blankGrid(black, cfg.rows, cfg.cols);
      placeWords(letterGrid, slots, assigned);
      const { cells, numberAt } = numberCells(letterGrid, cfg.rows, cfg.cols);
      return {
        rows: cfg.rows,
        cols: cfg.cols,
        difficulty,
        cells,
        entries: buildEntries(slots, letterGrid, numberAt),
      };
    }
  }
  throw new Error('Impossibile generare lo schema di cruciverba');
}

module.exports = { generateCrossword };
