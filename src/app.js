const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const database = require('./database/connection');
const voicebotRoutes = require('./routes/voicebotRoutes');

class App {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    initializeMiddlewares() {
        // CORS - permitir requisições de qualquer origem
        this.app.use(cors({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
            credentials: false
        }));

        // Body parser
        this.app.use(bodyParser.json({ limit: '10mb' }));
        this.app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

        // Servir arquivos estáticos do frontend
        this.app.use(express.static(path.join(__dirname, '../../frontend')));

        // Log de requisições
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
            next();
        });
    }

    initializeRoutes() {
        // Rota principal - servir o frontend
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../../frontend/index.html'));
        });

        // Rotas da API
        this.app.use('/api', voicebotRoutes);

        // Rota de health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                service: 'Evertec VoiceBot Configuration API',
                version: '1.0.0'
            });
        });
    }

    initializeErrorHandling() {
        // Middleware de tratamento de erros
        this.app.use((error, req, res, next) => {
            console.error('Erro não tratado:', error);
            
            res.status(error.status || 500).json({
                success: false,
                message: error.message || 'Erro interno do servidor',
                error: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        });

        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({
                success: false,
                message: 'Rota não encontrada',
                path: req.originalUrl
            });
        });
    }

    async start() {
        try {
            // Conectar ao banco de dados
            await database.connect();
            console.log('✅ Banco de dados conectado e inicializado');

            // Iniciar servidor
            this.app.listen(this.port, '0.0.0.0', () => {
                console.log(`🚀 Servidor rodando em http://0.0.0.0:${this.port}`);
                console.log(`📱 Frontend disponível em http://0.0.0.0:${this.port}`);
                console.log(`🔗 API disponível em http://0.0.0.0:${this.port}/api`);
                console.log(`❤️  Health check em http://0.0.0.0:${this.port}/health`);
            });

        } catch (error) {
            console.error('❌ Erro ao iniciar aplicação:', error);
            process.exit(1);
        }
    }

    // Graceful shutdown
    setupGracefulShutdown() {
        process.on('SIGTERM', () => {
            console.log('🛑 Recebido SIGTERM, encerrando servidor...');
            database.close();
            process.exit(0);
        });

        process.on('SIGINT', () => {
            console.log('🛑 Recebido SIGINT, encerrando servidor...');
            database.close();
            process.exit(0);
        });
    }
}

module.exports = App;

