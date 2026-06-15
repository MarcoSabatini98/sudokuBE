'use strict';

const asyncHandler = require('../utils/asyncHandler');
const machiavelliService = require('../services/machiavelli.service');
const { sendSuccess } = require('../utils/http.response');

const getAll = asyncHandler(async (req, res) => {
  const result = await machiavelliService.getAll(req.query);
  return sendSuccess(res, 200, result);
});

const save = asyncHandler(async (req, res) => {
  const game = await machiavelliService.save(req.body);
  return sendSuccess(res, 201, game);
});

const getRecord = asyncHandler(async (req, res) => {
  const record = await machiavelliService.getRecord();
  return sendSuccess(res, 200, record);
});

// fallow-ignore-file duplicate-export
module.exports = { getAll, save, getRecord };
