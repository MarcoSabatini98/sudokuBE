'use strict';

const sendSuccess = (res, statusCode, data = null) =>
  res.status(statusCode).json({ status: 'success', success: true, data });

const sendFail = (res, statusCode, data = null) =>
  res.status(statusCode).json({ status: 'fail', success: false, ...data });

const sendError = (res, statusCode, message) =>
  res.status(statusCode).json({ status: 'error', success: false, message });

module.exports = { sendSuccess, sendFail, sendError };
