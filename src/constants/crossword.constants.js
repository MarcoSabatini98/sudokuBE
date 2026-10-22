'use strict';

const DIFFICULTIES = ['easy', 'medium', 'hard'];

// Schemi in formato paesaggio (come i cruciverba da giornale): righe×colonne e
// densità di caselle nere. La difficoltà cresce con la dimensione della griglia.
const DIFFICULTY_CONFIG = {
  easy: { rows: 9, cols: 11, blackRatio: 0.32 },
  medium: { rows: 11, cols: 13, blackRatio: 0.3 },
  hard: { rows: 13, cols: 15, blackRatio: 0.28 },
};

// Lunghezza minima di una parola (slot). Sotto, è una casella non incrociata.
const MIN_SLOT = 3;

// Limiti di generazione: si abbandona in fretta un pattern ostico (budget
// passi basso) e se ne prova un altro — quasi tutti si riempiono velocemente.
const MAX_PATTERN_ATTEMPTS = 120;
const MAX_FILL_STEPS = 4000;

module.exports = {
  DIFFICULTIES,
  DIFFICULTY_CONFIG,
  MIN_SLOT,
  MAX_PATTERN_ATTEMPTS,
  MAX_FILL_STEPS,
};
