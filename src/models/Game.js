'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { DIFFICULTIES } = require('../constants/sudoku.constants');

const Game = sequelize.define(
  'Game',
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
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'games',
    timestamps: true,
    createdAt: 'played_at',
    updatedAt: false,
  }
);

module.exports = Game;
