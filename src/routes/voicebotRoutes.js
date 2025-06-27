const express = require('express');
const router = express.Router();
const controller = require('../controllers/voicebotController');

router.post('/voicebot/configuration', controller.createOrUpdateConfiguration);
router.get('/voicebot/configuration', controller.getSingleConfiguration);

module.exports = router;
