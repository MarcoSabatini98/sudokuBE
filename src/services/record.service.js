'use strict';

const recordRepository = require('../repositories/record.repository');
const AppError = require('../errors/AppError');
const { DIFFICULTIES } = require('../constants/sudoku.constants');

const getAll = async () => recordRepository.findAll();

const getByDifficulty = async (difficulty) => {
  if (!DIFFICULTIES.includes(difficulty)) {
    throw new AppError(`Difficoltà non valida: ${difficulty}`, 400);
  }
  return recordRepository.findByDifficulty(difficulty);
};

module.exports = { getAll, getByDifficulty };
