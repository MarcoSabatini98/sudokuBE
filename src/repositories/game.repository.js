'use strict';

const { Game } = require('../models');

const findAll = async ({ difficulty, page = 1, limit = 20 } = {}) => {
  const where = {};
  if (difficulty) where.difficulty = difficulty;

  const offset = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Game.findAll({
      where,
      order: [['played_at', 'DESC']],
      limit,
      offset,
    }),
    Game.count({ where }),
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const create = async (payload, transaction = null) =>
  Game.create(payload, { transaction });

// fallow-ignore-file duplicate-export
module.exports = { findAll, create };
