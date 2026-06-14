'use strict';

const Game = require('./Game');
const Record = require('./Record');
const sequelize = require('../config/db');

Record.belongsTo(Game, { foreignKey: 'game_id', as: 'best_game' });
Game.hasOne(Record, { foreignKey: 'game_id', as: 'record' });

module.exports = { sequelize, Game, Record };
