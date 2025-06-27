const database = require('../database/connection');
const encryption = require('../middleware/encryption');

module.exports = {
    async createOrUpdate(data) {
        const existing = await database.get(`SELECT id FROM voicebot_configurations LIMIT 1`);
        const encryptedApiKey = encryption.encryptSimple(data.openai_api_key);
        const params = [
            encryptedApiKey,
            data.openai_model,
            data.voice_type,
            data.agent_language,
            data.agent_name,
            data.client_phonetic_name,
            data.client_website,
            data.agent_personality,
            data.demo_scenario
        ];
        if (existing) {
            const sql = `UPDATE voicebot_configurations SET 
                openai_api_key = ?, openai_model = ?, voice_type = ?, agent_language = ?, 
                agent_name = ?, client_phonetic_name = ?, client_website = ?, 
                agent_personality = ?, demo_scenario = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?`;
            params.push(existing.id);
            await database.run(sql, params);
            return { success: true, id: existing.id };
        } else {
            const sql = `INSERT INTO voicebot_configurations 
                (openai_api_key, openai_model, voice_type, agent_language, agent_name, 
                client_phonetic_name, client_website, agent_personality, demo_scenario)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const result = await database.run(sql, params);
            return { success: true, id: result.id };
        }
    },

    async getSingle() {
        const sql = `SELECT * FROM voicebot_configurations ORDER BY updated_at DESC LIMIT 1`;
        const row = await database.get(sql);
        if (!row) return null;
        try {
            row.openai_api_key = encryption.decryptSimple(row.openai_api_key);
        } catch {
            row.openai_api_key = '';
        }
        return row;
    }
};
