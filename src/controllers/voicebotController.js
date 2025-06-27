const VoiceBotModel = require('../models/voicebotModel');
const encryption = require('../middleware/encryption');

class VoiceBotController {

    // Criar nova configuração de VoiceBot
    async createConfiguration(req, res) {
        try {
            console.log('Recebendo dados para criar configuração:', req.body);

            const result = await VoiceBotModel.create(req.body);

            res.status(201).json({
                success: true,
                message: 'VoiceBot configuration created successfully',
                unique_id: result.unique_id,
                id: result.id
            });

        } catch (error) {
            console.error('Erro no controller ao criar configuração:', error);
            
            res.status(400).json({
                success: false,
                message: error.message || 'Erro interno do servidor',
                error: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    // Obter configuração por ID único
    async getConfiguration(req, res) {
        try {
            const { unique_id } = req.params;

            if (!unique_id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID único é obrigatório'
                });
            }

            const configuration = await VoiceBotModel.findByUniqueId(unique_id);

            if (!configuration) {
                return res.status(404).json({
                    success: false,
                    message: 'Configuração não encontrada'
                });
            }

            // Mascarar API key na resposta
            const responseData = {
                ...configuration,
                openai_api_key_masked: encryption.maskApiKey(configuration.openai_api_key)
            };

            // Remover API key real da resposta
            delete responseData.openai_api_key;

            res.json({
                success: true,
                data: responseData
            });

        } catch (error) {
            console.error('Erro no controller ao buscar configuração:', error);
            
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    // Obter configuração completa (com API key) - endpoint interno
    async getFullConfiguration(req, res) {
        try {
            const { unique_id } = req.params;

            if (!unique_id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID único é obrigatório'
                });
            }

            const configuration = await VoiceBotModel.findByUniqueId(unique_id);

            if (!configuration) {
                return res.status(404).json({
                    success: false,
                    message: 'Configuração não encontrada'
                });
            }

            res.json({
                success: true,
                data: configuration
            });

        } catch (error) {
            console.error('Erro no controller ao buscar configuração completa:', error);
            
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    // Listar todas as configurações
    async listConfigurations(req, res) {
        try {
            const configurations = await VoiceBotModel.findAll();
            const total = await VoiceBotModel.count();

            res.json({
                success: true,
                data: configurations,
                total: total
            });

        } catch (error) {
            console.error('Erro no controller ao listar configurações:', error);
            
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    // Endpoint de status da API
    async getStatus(req, res) {
        try {
            const total = await VoiceBotModel.count();
            
            res.json({
                success: true,
                message: 'Evertec VoiceBot Configuration API is running',
                version: '1.0.0',
                timestamp: new Date().toISOString(),
                total_configurations: total
            });

        } catch (error) {
            console.error('Erro no controller ao obter status:', error);
            
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

module.exports = new VoiceBotController();

