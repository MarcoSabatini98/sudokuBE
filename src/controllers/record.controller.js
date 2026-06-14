'use strict';

const recordService = require('../services/record.service');
const { sendSuccess } = require('../utils/http.response');

const getAll = async (req, res, next) => {
  try {
    const records = await recordService.getAll();
    return sendSuccess(res, 200, records);
  } catch (err) {
    return next(err);
  }
};

const getByDifficulty = async (req, res, next) => {
  try {
    const record = await recordService.getByDifficulty(req.params.difficulty);
    return sendSuccess(res, 200, record);
  } catch (err) {
    return next(err);
  }
};

module.exports = { getAll, getByDifficulty };
