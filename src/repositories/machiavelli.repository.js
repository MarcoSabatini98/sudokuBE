'use strict';

const { MachiavelliGame } = require('../models');

const findAll = async ({ page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;

  const [data, total] = await Promise.all([
    MachiavelliGame.findAll({
      order: [['played_at', 'DESC']],
      limit,
      offset,
    }),
    MachiavelliGame.count(),
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

/** Partita vinta col tempo più breve, oppure null se non ci sono vittorie. */
const findBestWin = async () =>
  MachiavelliGame.findOne({
    where: { won: true },
    order: [['duration_seconds', 'ASC']],
  });

// fallow-ignore-file duplicate-export
module.exports = { findAll, create, findBestWin };
