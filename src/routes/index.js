'use strict';

const router = require('express').Router();

router.use('/sudoku', require('./sudoku.routes'));
router.use('/games', require('./game.routes'));
router.use('/records', require('./record.routes'));

module.exports = router;
