#!/usr/bin/env node

/**
 * Evertec VoiceBot Configuration Server
 * Servidor Node.js para configuração de VoiceBots
 */

require('dotenv').config();
const App = require('./src/app');

// Configurar variáveis de ambiente padrão
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;

console.log('🎯 Iniciando Evertec VoiceBot Configuration Server...');
console.log(`📊 Ambiente: ${process.env.NODE_ENV}`);
console.log(`🔧 Porta: ${process.env.PORT}`);

// Criar e iniciar aplicação
const app = new App();

// Configurar graceful shutdown
app.setupGracefulShutdown();

// Iniciar servidor
app.start().catch(error => {
    console.error('❌ Falha crítica ao iniciar servidor:', error);
    process.exit(1);
});

