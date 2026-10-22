'use strict';

const Joi = require('joi');
const { DIFFICULTIES } = require('../constants/sudoku.constants');
const { paginationFields } = require('./pagination.validator');

const saveGameSchema = Joi.object({
  difficulty:   Joi.string().valid(...DIFFICULTIES).required(),
  time_seconds: Joi.number().integer().min(1).required(),
  completed:    Joi.boolean().default(true),
});

const gameQuerySchema = Joi.object({
  difficulty: Joi.string().valid(...DIFFICULTIES).optional(),
  ...paginationFields,
});

module.exports = { saveGameSchema, gameQuerySchema };
