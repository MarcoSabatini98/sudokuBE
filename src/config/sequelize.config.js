'use strict';

require('dotenv').config();
const Joi = require('joi');

const schema = Joi.object({
  DB_HOST:     Joi.string().required(),
  DB_PORT:     Joi.number().integer().default(3306),
  DB_USER:     Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').default(''),
  DB_NAME:     Joi.string().required(),
  DB_TIMEZONE: Joi.string().default('+02:00'),
}).unknown(true);

const { error, value: env } = schema.validate(process.env);
if (error) throw new Error(`DB config error: ${error.message}`);

const config = {
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  host:     env.DB_HOST,
  port:     env.DB_PORT,
  dialect:  'mysql',
  timezone: env.DB_TIMEZONE,
  pool: {
    max:     parseInt(process.env.DB_POOL_MAX)     || 10,
    min:     parseInt(process.env.DB_POOL_MIN)     || 0,
    acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
    idle:    parseInt(process.env.DB_POOL_IDLE)    || 10000,
  },
  dialectOptions: {
    charset: 'utf8mb4',
    connectTimeout: 10000,
  },
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
};

module.exports = {
  development: config,
  test:        config,
  production:  config,
};
