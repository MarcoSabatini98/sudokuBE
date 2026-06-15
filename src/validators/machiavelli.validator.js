'use strict';

const Joi = require('joi');
const { paginationFields } = require('./pagination.validator');

const saveGameSchema = Joi.object({
  won:              Joi.boolean().required(),
  duration_seconds: Joi.number().integer().min(1).required(),
});

const gameQuerySchema = Joi.object({ ...paginationFields });

module.exports = { saveGameSchema, gameQuerySchema };
