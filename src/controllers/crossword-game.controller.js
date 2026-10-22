'use strict';

const asyncHandler = require('../utils/asyncHandler');
const crosswordGameService = require('../services/crossword-game.service');
const { sendSuccess } = require('../utils/http.response');

const getAll = asyncHandler(async (req, res) => {
  const result = await crosswordGameService.getAll(req.query);
  return sendSuccess(res, 200, result);
});

const save = asyncHandler(async (req, res) => {
  const game = await crosswordGameService.save(req.body);
  return sendSuccess(res, 201, game);
});

const getRecords = asyncHandler(async (req, res) => {
  const records = await crosswordGameService.getRecords();
  return sendSuccess(res, 200, records);
});

// fallow-ignore-file duplicate-export
module.exports = { getAll, save, getRecords };
