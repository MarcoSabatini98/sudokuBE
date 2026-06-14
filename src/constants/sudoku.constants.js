'use strict';

const DIFFICULTIES = ['easy', 'medium', 'hard', 'extreme'];

const DIFFICULTY_CONFIG = {
  easy:    { cellsToRemove: 36, label: 'Facile' },
  medium:  { cellsToRemove: 46, label: 'Medio' },
  hard:    { cellsToRemove: 51, label: 'Difficile' },
  extreme: { cellsToRemove: 56, label: 'Estremo' },
};

module.exports = { DIFFICULTIES, DIFFICULTY_CONFIG };
