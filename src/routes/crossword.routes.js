'use strict';

const router = require('express').Router();
const controller = require('../controllers/crossword.controller');

router.get('/generate', controller.generate);

module.exports = router;
