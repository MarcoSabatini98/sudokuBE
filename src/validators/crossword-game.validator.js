'use strict';

const Joi = require('joi');
const { DIFFICULTIES } = require('../constants/crossword.constants');
const { paginationFields } = require('./pagination.validator');

const saveGameSchema = Joi.object({
  difficulty:   Joi.string().valid(...DIFFICULTIES).required(),
  time_seconds: Joi.number().integer().min(1).required(),
});

const gameQuerySchema = Joi.object({
  difficulty: Joi.string().valid(...DIFFICULTIES).optional(),
  ...paginationFields,
});

module.exports = { saveGameSchema, gameQuerySchema };
