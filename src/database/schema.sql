-- Schema para o banco de dados VoiceBot Configuration
-- Arquivo: schema.sql

CREATE TABLE IF NOT EXISTS voicebot_configurations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unique_id TEXT UNIQUE NOT NULL,
    openai_api_key TEXT NOT NULL,
    openai_model TEXT NOT NULL DEFAULT 'gpt-4-turbo',
    voice_type TEXT NOT NULL CHECK (voice_type IN ('Male', 'Female')),
    agent_language TEXT NOT NULL,
    agent_name TEXT NOT NULL,
    client_phonetic_name TEXT NOT NULL,
    client_website TEXT,
    agent_personality TEXT NOT NULL,
    demo_scenario TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_unique_id ON voicebot_configurations(unique_id);
CREATE INDEX IF NOT EXISTS idx_created_at ON voicebot_configurations(created_at);

