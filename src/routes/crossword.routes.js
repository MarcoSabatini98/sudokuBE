'use strict';

const router = require('express').Router();
const controller = require('../controllers/crossword.controller');
const gameController = require('../controllers/crossword-game.controller');
const validate = require('../middlewares/validate');
const { saveGameSchema, gameQuerySchema } = require('../validators/crossword-game.validator');

router.get('/generate', controller.generate);

router.get('/records', gameController.getRecords);
router.get('/games', validate(gameQuerySchema, 'query'), gameController.getAll);
router.post('/games', validate(saveGameSchema), gameController.save);

module.exports = router;
