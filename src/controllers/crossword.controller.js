'use strict';

const asyncHandler = require('../utils/asyncHandler');
const { generateCrossword } = require('../services/crossword.service');
const { sendSuccess } = require('../utils/http.response');

const generate = asyncHandler(async (req, res) => {
  const crossword = generateCrossword();
  return sendSuccess(res, 200, crossword);
});

module.exports = { generate };
