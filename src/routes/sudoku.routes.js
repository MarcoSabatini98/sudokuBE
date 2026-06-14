'use strict';

const router = require('express').Router();
const controller = require('../controllers/sudoku.controller');

router.get('/generate', controller.generate);

module.exports = router;
