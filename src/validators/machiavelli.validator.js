'use strict';

const Joi = require('joi');
const { BOT_DIFFICULTIES } = require('../constants/machiavelli.constants');
const { paginationFields } = require('./pagination.validator');

const saveGameSchema = Joi.object({
  won:              Joi.boolean().required(),
  duration_seconds: Joi.number().integer().min(1).required(),
  bot_difficulty:   Joi.string().valid(...BOT_DIFFICULTIES).required(),
});

const gameQuerySchema = Joi.object({
  bot_difficulty: Joi.string().valid(...BOT_DIFFICULTIES).optional(),
  ...paginationFields,
});

module.exports = { saveGameSchema, gameQuerySchema };
