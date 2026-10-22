'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { BOT_DIFFICULTIES } = require('../constants/machiavelli.constants');

const MachiavelliGame = sequelize.define(
  'MachiavelliGame',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    bot_difficulty: {
      type: DataTypes.ENUM(...BOT_DIFFICULTIES),
      allowNull: false,
    },
    won: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    duration_seconds: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    tableName: 'machiavelli_games',
    timestamps: true,
    createdAt: 'played_at',
    updatedAt: false,
  }
);

module.exports = MachiavelliGame;
