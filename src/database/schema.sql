-- Schema simplificado para uma única configuração persistente (sem unique_id)
CREATE TABLE IF NOT EXISTS voicebot_configurations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_created_at ON voicebot_configurations(created_at);
