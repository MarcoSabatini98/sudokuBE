'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { DIFFICULTIES } = require('../constants/crossword.constants');

// Schemi di cruciverba pre-generati offline (vedi scripts/build-puzzles.js).
// payload = oggetto completo { rows, cols, difficulty, cells, entries }.
const CrosswordPuzzle = sequelize.define(
  'CrosswordPuzzle',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    difficulty: {
      type: DataTypes.ENUM(...DIFFICULTIES),
      allowNull: false,
    },
    payload: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: 'crossword_puzzles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

module.exports = CrosswordPuzzle;
