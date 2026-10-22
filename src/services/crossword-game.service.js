'use strict';

const crosswordGameRepository = require('../repositories/crossword-game.repository');

const getAll = async (filters) => crosswordGameRepository.findAll(filters);

const save = async ({ difficulty, time_seconds }) =>
  crosswordGameRepository.create({ difficulty, time_seconds });

const getRecords = async () => crosswordGameRepository.bestByDifficulty();

module.exports = { getAll, save, getRecords };
