'use strict';

const { CrosswordPuzzle, sequelize } = require('../models');

/** Uno schema a caso per difficoltà, oppure null se non ce ne sono. */
const findRandom = async (difficulty) =>
  CrosswordPuzzle.findOne({ where: { difficulty }, order: sequelize.random() });

const saveMany = async (difficulty, payloads) =>
  CrosswordPuzzle.bulkCreate(payloads.map((payload) => ({ difficulty, payload })));

const clearByDifficulty = async (difficulty) =>
  CrosswordPuzzle.destroy({ where: { difficulty } });

// fallow-ignore-file duplicate-export
module.exports = { findRandom, saveMany, clearByDifficulty };
