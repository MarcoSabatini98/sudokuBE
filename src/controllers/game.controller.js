'use strict';

const gameService = require('../services/game.service');
const { sendSuccess } = require('../utils/http.response');

const getAll = async (req, res, next) => {
  try {
    const result = await gameService.getAll(req.query);
    return sendSuccess(res, 200, result);
  } catch (err) {
    return next(err);
  }
};

const save = async (req, res, next) => {
  try {
    const game = await gameService.save(req.body);
    return sendSuccess(res, 201, game);
  } catch (err) {
    return next(err);
  }
};

// fallow-ignore-file duplicate-export
module.exports = { getAll, save };
