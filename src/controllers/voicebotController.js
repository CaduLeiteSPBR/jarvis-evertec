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
            const config = await VoiceBotModel.getSingle();
            if (!config) {
                return res.status(404).json({ success: false, message: 'Configuração não encontrada' });
            }
            config.openai_api_key_masked = encryption.maskApiKey(config.openai_api_key);
            delete config.openai_api_key;
            res.json({ success: true, data: config });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
