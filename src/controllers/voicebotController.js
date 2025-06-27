const VoiceBotModel = require('../models/voicebotModel');
const encryption = require('../middleware/encryption');

module.exports = {
    async createOrUpdateConfiguration(req, res) {
        try {
            const result = await VoiceBotModel.createOrUpdate(req.body);
            res.status(200).json({
                success: true,
                message: 'Configuration saved',
                id: result.id
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Erro interno ao salvar configuração'
            });
        }
    },

    async getSingleConfiguration(req, res) {
        try {
        const config = await voicebotModel.getConfiguration();

        if (!config) {
            return res.status(404).json({ message: 'Configuration not found.' });
        }

        // ⚠️ Mascarar a API Key para exibir no frontend
        if (config.openai_api_key) {
            config.openai_api_key = '••••••' + config.openai_api_key.slice(-4);
        }

        res.status(200).json(config);
    } catch (error) {
        console.error('Error retrieving configuration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}