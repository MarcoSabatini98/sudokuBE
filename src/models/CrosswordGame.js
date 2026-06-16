'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { DIFFICULTIES } = require('../constants/crossword.constants');

// Partite di cruciverba completate: tempo di completamento per difficoltà.
const CrosswordGame = sequelize.define(
  'CrosswordGame',
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
    time_seconds: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    tableName: 'crossword_games',
    timestamps: true,
    createdAt: 'played_at',
    updatedAt: false,
  }
);

module.exports = CrosswordGame;
