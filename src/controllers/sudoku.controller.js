'use strict';

const { generatePuzzle } = require('../services/sudoku.service');
const { sendSuccess, sendFail } = require('../utils/http.response');
const { DIFFICULTIES } = require('../constants/sudoku.constants');

const generate = (req, res, next) => {
  try {
    const difficulty = req.query.difficulty || 'easy';
    if (!DIFFICULTIES.includes(difficulty)) {
      return sendFail(res, 400, { message: `Difficoltà non valida. Valori: ${DIFFICULTIES.join(', ')}` });
    }
    const { puzzle, solution } = generatePuzzle(difficulty);
    return sendSuccess(res, 200, { difficulty, puzzle, solution });
  } catch (err) {
    return next(err);
  }
};

module.exports = { generate };
