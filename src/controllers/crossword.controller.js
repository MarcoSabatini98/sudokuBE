'use strict';

const asyncHandler = require('../utils/asyncHandler');
const { generateCrossword } = require('../services/crossword.service');
const { sendSuccess, sendFail } = require('../utils/http.response');
const { DIFFICULTIES } = require('../constants/crossword.constants');

const generate = asyncHandler(async (req, res) => {
  const difficulty = req.query.difficulty || 'medium';
  if (!DIFFICULTIES.includes(difficulty)) {
    return sendFail(res, 400, { message: `Difficoltà non valida. Valori: ${DIFFICULTIES.join(', ')}` });
  }
  const crossword = generateCrossword({ difficulty });
  return sendSuccess(res, 200, crossword);
});

module.exports = { generate };
