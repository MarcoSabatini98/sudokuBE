'use strict';

const asyncHandler = require('../utils/asyncHandler');
const gameService = require('../services/game.service');
const { sendSuccess } = require('../utils/http.response');

const getAll = asyncHandler(async (req, res) => {
  const result = await gameService.getAll(req.query);
  return sendSuccess(res, 200, result);
});

const save = asyncHandler(async (req, res) => {
  const game = await gameService.save(req.body);
  return sendSuccess(res, 201, game);
});

// fallow-ignore-file duplicate-export
module.exports = { getAll, save };
