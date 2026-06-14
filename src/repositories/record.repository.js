'use strict';

const { Record, Game } = require('../models');

const findAll = async () =>
  Record.findAll({
    include: [{ model: Game, as: 'best_game', attributes: ['played_at'] }],
    order: [['difficulty', 'ASC']],
  });

const findByDifficulty = async (difficulty) =>
  Record.findOne({
    where: { difficulty },
    include: [{ model: Game, as: 'best_game', attributes: ['played_at'] }],
  });

const upsert = async (difficulty, best_time_seconds, game_id, transaction = null) => {
  const existing = await Record.findOne({ where: { difficulty }, transaction });

  if (!existing) {
    return Record.create({ difficulty, best_time_seconds, game_id }, { transaction });
  }

  if (best_time_seconds < existing.best_time_seconds) {
    await existing.update({ best_time_seconds, game_id }, { transaction });
  }

  return existing;
};

module.exports = { findAll, findByDifficulty, upsert };
