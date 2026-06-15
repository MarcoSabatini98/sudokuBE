'use strict';

/** Avvolge un handler async: inoltra automaticamente gli errori a next(). */
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
