'use strict';

process.env.TZ = 'Europe/Rome';
require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./src/models');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    logger.info(`DB connesso: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
    logger.info(`Server avviato su porta ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  } catch (err) {
    logger.error('Connessione DB fallita', err);
    process.exit(1);
  }
});

const shutdown = async (signal) => {
  logger.info(`${signal} ricevuto — chiusura in corso...`);
  server.close(async () => {
    await sequelize.close();
    logger.info('Server e DB chiusi.');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', reason);
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', err);
  process.exit(1);
});
