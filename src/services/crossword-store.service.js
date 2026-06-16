'use strict';

const crosswordRepository = require('../repositories/crossword.repository');
const { generateCrossword } = require('./crossword.service');

/**
 * Serve uno schema pre-generato a caso per la difficoltà data (risposta
 * istantanea). Se la tabella è vuota — es. migrazione fatta ma build non ancora
 * eseguita — ripiega sulla generazione live.
 */
async function getServedPuzzle({ difficulty = 'medium' } = {}) {
  const saved = await crosswordRepository.findRandom(difficulty);
  if (saved) return saved.payload;
  return generateCrossword({ difficulty });
}

module.exports = { getServedPuzzle };
