'use strict';

const router = require('express').Router();
const controller = require('../controllers/record.controller');

router.get('/', controller.getAll);
router.get('/:difficulty', controller.getByDifficulty);

module.exports = router;
