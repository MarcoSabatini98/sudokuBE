'use strict';

const { Sequelize } = require('sequelize');
const configs = require('./sequelize.config');

const env = process.env.NODE_ENV || 'development';
const config = configs[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

module.exports = sequelize;
