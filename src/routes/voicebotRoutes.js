const express = require('express');
const router = express.Router();
const controller = require('../controllers/voicebotController');

router.get('/configuration', controller.getSingleConfiguration);
router.post('/configuration', controller.createOrUpdateConfiguration);

module.exports = router;
