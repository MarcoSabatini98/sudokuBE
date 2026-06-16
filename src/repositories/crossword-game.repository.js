'use strict';

const { fn, col } = require('sequelize');
const { CrosswordGame } = require('../models');

const findAll = async ({ difficulty, page = 1, limit = 20 } = {}) => {
  const where = {};
  if (difficulty) where.difficulty = difficulty;

  const offset = (page - 1) * limit;

  const [data, total] = await Promise.all([
    CrosswordGame.findAll({ where, order: [['played_at', 'DESC']], limit, offset }),
    CrosswordGame.count({ where }),
  ]);

  return {
    data,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

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
