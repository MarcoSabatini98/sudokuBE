'use strict';

const { fn, col } = require('sequelize');
const { MachiavelliGame } = require('../models');

const findAll = async ({ page = 1, limit = 20, bot_difficulty } = {}) => {
  const offset = (page - 1) * limit;
  const where = bot_difficulty ? { bot_difficulty } : undefined;

  const [data, total] = await Promise.all([
    MachiavelliGame.findAll({
      where,
      order: [['played_at', 'DESC']],
      limit,
      offset,
    }),
    MachiavelliGame.count({ where }),
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

const create = async (payload) => MachiavelliGame.create(payload);

/** Miglior tempo di vittoria per ciascuna difficoltà bot:
 *  [{ bot_difficulty, best_time_seconds }]. */
const bestWinByDifficulty = async () =>
  MachiavelliGame.findAll({
    attributes: ['bot_difficulty', [fn('MIN', col('duration_seconds')), 'best_time_seconds']],
    where: { won: true },
    group: ['bot_difficulty'],
    raw: true,
  });

// fallow-ignore-file duplicate-export
module.exports = { findAll, create, bestWinByDifficulty };
