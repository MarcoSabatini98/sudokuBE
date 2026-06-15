'use strict';

const asyncHandler = require('../utils/asyncHandler');
const recordService = require('../services/record.service');
const { sendSuccess } = require('../utils/http.response');

const getAll = asyncHandler(async (req, res) => {
  const records = await recordService.getAll();
  return sendSuccess(res, 200, records);
});

const getByDifficulty = asyncHandler(async (req, res) => {
  const record = await recordService.getByDifficulty(req.params.difficulty);
  return sendSuccess(res, 200, record);
});

// fallow-ignore-file duplicate-export
module.exports = { getAll, getByDifficulty };
