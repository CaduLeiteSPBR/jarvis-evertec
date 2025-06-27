const database = require('../database/connection');
const encryption = require('../middleware/encryption');
const { v4: uuidv4 } = require('uuid');

class VoiceBotModel {
    
    // Gerar ID único para o VoiceBot
    generateUniqueId() {
        return 'vb_' + uuidv4().replace(/-/g, '').substring(0, 12);
    }

    // Validar dados de entrada
    validateData(data) {
        const errors = [];

        if (!data.openai_api_key || !data.openai_api_key.startsWith('sk-')) {
            errors.push('OpenAI API Key é obrigatória e deve começar com "sk-"');
        }

        if (!data.openai_model) {
            errors.push('Modelo OpenAI é obrigatório');
        }

        if (!data.voice_type || !['Male', 'Female'].includes(data.voice_type)) {
            errors.push('Tipo de voz deve ser "Male" ou "Female"');
        }

        if (!data.agent_language) {
            errors.push('Idioma do agente é obrigatório');
        }

        if (!data.agent_name || data.agent_name.trim().length === 0) {
            errors.push('Nome do agente é obrigatório');
        }

        if (!data.client_phonetic_name || data.client_phonetic_name.trim().length === 0) {
            errors.push('Nome fonético do cliente é obrigatório');
        }

        if (!data.agent_personality) {
            errors.push('Personalidade do agente é obrigatória');
        }

        if (!data.demo_scenario) {
            errors.push('Cenário de demonstração é obrigatório');
        }

        // Validar URL do website se fornecida
        if (data.client_website && data.client_website.trim().length > 0) {
            try {
                new URL(data.client_website);
            } catch (error) {
                errors.push('Website do cliente deve ser uma URL válida');
            }
        }

        return errors;
    }

    // Criar nova configuração
    async create(data) {
        try {
            // Validar dados
            const validationErrors = this.validateData(data);
            if (validationErrors.length > 0) {
                throw new Error('Dados inválidos: ' + validationErrors.join(', '));
            }

            // Gerar ID único
            const uniqueId = this.generateUniqueId();

            // Criptografar API key
            const encryptedApiKey = encryption.encryptSimple(data.openai_api_key);

            // Preparar dados para inserção
            const insertData = {
                unique_id: uniqueId,
                openai_api_key: encryptedApiKey,
                openai_model: data.openai_model,
                voice_type: data.voice_type,
                agent_language: data.agent_language,
                agent_name: data.agent_name.trim(),
                client_phonetic_name: data.client_phonetic_name.trim(),
                client_website: data.client_website ? data.client_website.trim() : null,
                agent_personality: data.agent_personality,
                demo_scenario: data.demo_scenario
            };

            // SQL de inserção
            const sql = `
                INSERT INTO voicebot_configurations 
                (unique_id, openai_api_key, openai_model, voice_type, agent_language, 
                 agent_name, client_phonetic_name, client_website, agent_personality, demo_scenario)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const params = [
                insertData.unique_id,
                insertData.openai_api_key,
                insertData.openai_model,
                insertData.voice_type,
                insertData.agent_language,
                insertData.agent_name,
                insertData.client_phonetic_name,
                insertData.client_website,
                insertData.agent_personality,
                insertData.demo_scenario
            ];

            const result = await database.run(sql, params);

            return {
                id: result.id,
                unique_id: uniqueId,
                success: true
            };

        } catch (error) {
            console.error('Erro ao criar configuração:', error);
            throw error;
        }
    }

    // Buscar configuração por ID único
    async findByUniqueId(uniqueId) {
        try {
            const sql = `
                SELECT id, unique_id, openai_api_key, openai_model, voice_type, 
                       agent_language, agent_name, client_phonetic_name, 
                       client_website, agent_personality, demo_scenario, 
                       created_at, updated_at
                FROM voicebot_configurations 
                WHERE unique_id = ?
            `;

            const row = await database.get(sql, [uniqueId]);

            if (!row) {
                return null;
            }

            // Descriptografar API key
            try {
                row.openai_api_key = encryption.decryptSimple(row.openai_api_key);
            } catch (error) {
                console.error('Erro ao descriptografar API key:', error);
                row.openai_api_key = '[ERRO_DESCRIPTOGRAFIA]';
            }

            return row;

        } catch (error) {
            console.error('Erro ao buscar configuração:', error);
            throw error;
        }
    }

    // Listar todas as configurações (sem API keys)
    async findAll() {
        try {
            const sql = `
                SELECT id, unique_id, agent_name, agent_language, 
                       demo_scenario, created_at
                FROM voicebot_configurations 
                ORDER BY created_at DESC
            `;

            const rows = await database.all(sql);
            return rows;

        } catch (error) {
            console.error('Erro ao listar configurações:', error);
            throw error;
        }
    }

    // Contar total de configurações
    async count() {
        try {
            const sql = 'SELECT COUNT(*) as total FROM voicebot_configurations';
            const result = await database.get(sql);
            return result.total;
        } catch (error) {
            console.error('Erro ao contar configurações:', error);
            throw error;
        }
    }
}

module.exports = new VoiceBotModel();

