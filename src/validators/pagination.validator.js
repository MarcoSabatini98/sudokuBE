'use strict';

const Joi = require('joi');

/** Campi di paginazione condivisi tra le query list. */
const paginationFields = {
  page:  Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
};

module.exports = { paginationFields };
