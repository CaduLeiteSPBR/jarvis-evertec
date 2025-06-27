const crypto = require('crypto');

class EncryptionService {
    constructor() {
        // Chave de criptografia - em produção deve vir de variável de ambiente
        this.secretKey = process.env.ENCRYPTION_KEY || 'evertec-voicebot-secret-key-2025-very-secure';
        this.algorithm = 'aes-256-cbc';
    }

    // Versão simplificada usando Buffer e hash
    encryptSimple(text) {
        try {
            // Para desenvolvimento, usar uma criptografia básica com Buffer
            const key = crypto.createHash('sha256').update(this.secretKey).digest();
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            
            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            
            return iv.toString('hex') + ':' + encrypted;
        } catch (error) {
            console.error('Erro na criptografia simples:', error);
            // Para desenvolvimento, retornar texto com prefixo indicando que não foi criptografado
            return 'PLAIN:' + text;
        }
    }

    decryptSimple(encryptedText) {
        try {
            // Verificar se é texto não criptografado
            if (encryptedText.startsWith('PLAIN:')) {
                return encryptedText.substring(6);
            }
            
            const parts = encryptedText.split(':');
            if (parts.length !== 2) {
                return encryptedText; // Retornar original se formato inválido
            }
            
            const key = crypto.createHash('sha256').update(this.secretKey).digest();
            const iv = Buffer.from(parts[0], 'hex');
            const encrypted = parts[1];
            
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            
            return decrypted;
        } catch (error) {
            console.error('Erro na descriptografia simples:', error);
            // Em caso de erro, retornar o texto original
            return encryptedText;
        }
    }

    // Função para mascarar API key na resposta
    maskApiKey(apiKey) {
        if (!apiKey || apiKey.length < 8) return '****';
        // Remover prefixo PLAIN: se existir
        const cleanKey = apiKey.startsWith('PLAIN:') ? apiKey.substring(6) : apiKey;
        return cleanKey.substring(0, 3) + '*'.repeat(Math.max(cleanKey.length - 6, 4)) + cleanKey.substring(cleanKey.length - 3);
    }
}

module.exports = new EncryptionService();

