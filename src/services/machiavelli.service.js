'use strict';

const machiavelliRepository = require('../repositories/machiavelli.repository');

const getAll = async (filters) => machiavelliRepository.findAll(filters);

const save = async ({ won, duration_seconds }) =>
  machiavelliRepository.create({ won, duration_seconds });

const getRecord = async () => {
  const best = await machiavelliRepository.findBestWin();
  return {
    best_time_seconds: best ? best.duration_seconds : null,
    best_game: best,
  };
};

module.exports = { getAll, save, getRecord };
