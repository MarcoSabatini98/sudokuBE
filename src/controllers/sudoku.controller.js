'use strict';

const asyncHandler = require('../utils/asyncHandler');
const { generatePuzzle } = require('../services/sudoku.service');
const { sendSuccess, sendFail } = require('../utils/http.response');
const { DIFFICULTIES } = require('../constants/sudoku.constants');

const generate = asyncHandler(async (req, res) => {
  const difficulty = req.query.difficulty || 'easy';
  if (!DIFFICULTIES.includes(difficulty)) {
    return sendFail(res, 400, { message: `Difficoltà non valida. Valori: ${DIFFICULTIES.join(', ')}` });
  }
  const { puzzle, solution } = generatePuzzle(difficulty);
  return sendSuccess(res, 200, { difficulty, puzzle, solution });
});

module.exports = { generate };
