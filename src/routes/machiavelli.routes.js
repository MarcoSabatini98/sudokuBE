'use strict';

const router = require('express').Router();
const controller = require('../controllers/machiavelli.controller');
const validate = require('../middlewares/validate');
const { saveGameSchema, gameQuerySchema } = require('../validators/machiavelli.validator');

router.get('/records', controller.getRecord);
router.get('/', validate(gameQuerySchema, 'query'), controller.getAll);
router.post('/', validate(saveGameSchema), controller.save);

module.exports = router;
