'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { DIFFICULTIES } = require('../constants/sudoku.constants');

const Record = sequelize.define(
  'Record',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    difficulty: {
      type: DataTypes.ENUM(...DIFFICULTIES),
      allowNull: false,
      unique: true,
    },
    best_time_seconds: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    game_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    tableName: 'records',
    timestamps: true,
    createdAt: false,
    updatedAt: 'updated_at',
  }
);

module.exports = Record;
