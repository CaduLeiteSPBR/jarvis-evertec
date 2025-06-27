const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
    constructor() {
        this.db = null;
        this.dbPath = path.join(__dirname, '../../../database/voicebot.db');
        this.schemaPath = path.join(__dirname, 'schema.sql');
    }

    async connect() {
        return new Promise((resolve, reject) => {
            // Criar diretório do banco se não existir
            const dbDir = path.dirname(this.dbPath);
            if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// 🔥 Forçar a exclusão do banco antigo para recriar com o novo schema
if (fs.existsSync(this.dbPath)) {
    fs.unlinkSync(this.dbPath);
    console.log('⚠️ Banco de dados antigo removido para recriação com novo schema');
}


            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Erro ao conectar com o banco de dados:', err);
                    reject(err);
                } else {
                    console.log('Conectado ao banco de dados SQLite');
                    this.initializeSchema()
                        .then(() => resolve())
                        .catch(reject);
                }
            });
        });
    }

    async initializeSchema() {
        return new Promise((resolve, reject) => {
            const schema = fs.readFileSync(this.schemaPath, 'utf8');
            this.db.exec(schema, (err) => {
                if (err) {
                    console.error('Erro ao inicializar schema:', err);
                    reject(err);
                } else {
                    console.log('Schema do banco de dados inicializado');
                    resolve();
                }
            });
        });
    }

    async run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    async get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    close() {
        if (this.db) {
            this.db.close((err) => {
                if (err) {
                    console.error('Erro ao fechar banco de dados:', err);
                } else {
                    console.log('Conexão com banco de dados fechada');
                }
            });
        }
    }
}

module.exports = new Database();

