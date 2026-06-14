'use strict';

const router = require('express').Router();
const controller = require('../controllers/game.controller');
const validate = require('../middlewares/validate');
const { saveGameSchema, gameQuerySchema } = require('../validators/game.validator');

router.get('/', validate(gameQuerySchema, 'query'), controller.getAll);
router.post('/', validate(saveGameSchema), controller.save);

module.exports = router;
