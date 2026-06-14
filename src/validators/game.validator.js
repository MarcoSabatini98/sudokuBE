'use strict';

const Joi = require('joi');
const { DIFFICULTIES } = require('../constants/sudoku.constants');

const saveGameSchema = Joi.object({
  difficulty:   Joi.string().valid(...DIFFICULTIES).required(),
  time_seconds: Joi.number().integer().min(1).required(),
  completed:    Joi.boolean().default(true),
});

const gameQuerySchema = Joi.object({
  difficulty: Joi.string().valid(...DIFFICULTIES).optional(),
  page:       Joi.number().integer().min(1).default(1),
  limit:      Joi.number().integer().min(1).max(100).default(20),
});

module.exports = { saveGameSchema, gameQuerySchema };
