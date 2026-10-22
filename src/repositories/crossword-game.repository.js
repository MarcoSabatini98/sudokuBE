'use strict';

const { fn, col } = require('sequelize');
const { CrosswordGame } = require('../models');
const { paginate } = require('./paginate');

const findAll = async (opts = {}) => paginate(CrosswordGame, opts);

const create = async (payload) => CrosswordGame.create(payload);

/** Miglior tempo per ciascuna difficoltà: [{ difficulty, best_time_seconds }]. */
const bestByDifficulty = async () =>
  CrosswordGame.findAll({
    attributes: ['difficulty', [fn('MIN', col('time_seconds')), 'best_time_seconds']],
    group: ['difficulty'],
    raw: true,
  });

// fallow-ignore-file duplicate-export
module.exports = { findAll, create, bestByDifficulty };
