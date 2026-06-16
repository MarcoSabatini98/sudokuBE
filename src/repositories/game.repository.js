'use strict';

const { Game } = require('../models');
const { paginate } = require('./paginate');

const findAll = async (opts = {}) => paginate(Game, opts);

const create = async (payload, transaction = null) =>
  Game.create(payload, { transaction });

// fallow-ignore-file duplicate-export
module.exports = { findAll, create };
