'use strict';

class AppError extends Error {
  constructor(message, statusCode, extra = {}) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.extra = extra;
  }
}

module.exports = AppError;
