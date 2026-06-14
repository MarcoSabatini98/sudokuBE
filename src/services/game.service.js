'use strict';

const { sequelize } = require('../models');
const gameRepository = require('../repositories/game.repository');
const recordRepository = require('../repositories/record.repository');

const getAll = async (filters) => gameRepository.findAll(filters);

const save = async ({ difficulty, time_seconds, completed = true }) => {
  const transaction = await sequelize.transaction();
  try {
    const game = await gameRepository.create({ difficulty, time_seconds, completed }, transaction);

    if (completed) {
      await recordRepository.upsert(difficulty, time_seconds, game.id, transaction);
    }

    await transaction.commit();
    return game;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

module.exports = { getAll, save };
