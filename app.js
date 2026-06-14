'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const logger = require('./src/utils/logger');
const { sendFail, sendError } = require('./src/utils/http.response');
const AppError = require('./src/errors/AppError');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(express.json());
app.use(morgan('dev', { stream: { write: (msg) => logger.http(msg.trim()) } }));

app.use('/api/v1', require('./src/routes'));

app.use((req, res) =>
  sendFail(res, 404, { message: `Route non trovata: ${req.method} ${req.originalUrl}` })
);

app.use((err, req, res, _next) => {
  logger.error(`${req.method} ${req.originalUrl} → ${err.message}`, { stack: err.stack });

  const ERROR_MAP = {
    SequelizeUniqueConstraintError:    { status: 409, message: 'Dato già esistente' },
    SequelizeForeignKeyConstraintError: { status: 400, message: 'Riferimento non valido' },
    SequelizeValidationError:          { status: 400, message: 'Dati non validi' },
  };

  const mapped = ERROR_MAP[err.name];
  if (mapped) return sendFail(res, mapped.status, { message: mapped.message });

  if (err instanceof AppError) {
    return err.statusCode < 500
      ? sendFail(res, err.statusCode, { message: err.message })
      : sendError(res, err.statusCode, err.message);
  }

  return sendError(
    res,
    500,
    process.env.NODE_ENV === 'production' ? 'Errore interno del server' : err.message
  );
});

module.exports = app;
