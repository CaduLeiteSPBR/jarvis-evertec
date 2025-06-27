const express = require('express');
const router = express.Router();
const VoiceBotController = require('../controllers/voicebotController');

// Middleware para log das requisições
router.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// Rota de status da API
router.get('/status', VoiceBotController.getStatus);

// Rotas para configurações de VoiceBot
router.post('/voicebot/configuration', VoiceBotController.createConfiguration);
router.get('/voicebot/configuration/:unique_id', VoiceBotController.getConfiguration);
router.get('/voicebot/configurations', VoiceBotController.listConfigurations);

// Rota interna para obter configuração completa (com API key)
router.get('/internal/voicebot/configuration/:unique_id', VoiceBotController.getFullConfiguration);

// Middleware de tratamento de erros 404
router.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint não encontrado',
        available_endpoints: [
            'GET /api/status',
            'POST /api/voicebot/configuration',
            'GET /api/voicebot/configuration/:unique_id',
            'GET /api/voicebot/configurations',
            'GET /api/internal/voicebot/configuration/:unique_id'
        ]
    });
});

module.exports = router;

