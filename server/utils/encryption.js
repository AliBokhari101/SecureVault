const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const KEY_LENGTH = 32; // 256 bits

/**
 * Generate a random encryption key
 * @returns {string} - 32-character encryption key
 */
exports.generateEncryptionKey = () => {
    return crypto.randomBytes(KEY_LENGTH).toString('hex').slice(0, KEY_LENGTH);
};

/**
 * Encrypt file buffer using AES-256-CBC
 * @param {Buffer} buffer - File buffer to encrypt
 * @returns {Object} - { encryptedData: Buffer, encryptionKey: string }
 */
exports.encryptFile = (buffer) => {
    try {
        // Generate random encryption key and IV
        const encryptionKey = exports.generateEncryptionKey();
        const iv = crypto.randomBytes(16);

        // Create cipher
        const cipher = crypto.createCipheriv(
            ALGORITHM,
            Buffer.from(encryptionKey, 'utf-8'),
            iv
        );

        // Encrypt the buffer
        const encryptedData = Buffer.concat([
            iv, // Prepend IV to encrypted data
            cipher.update(buffer),
            cipher.final()
        ]);

        return {
            encryptedData,
            encryptionKey
        };
    } catch (error) {
        throw new Error('Encryption failed: ' + error.message);
    }
};

/**
 * Decrypt file buffer using AES-256-CBC
 * @param {Buffer} encryptedBuffer - Encrypted file buffer (with IV prepended)
 * @param {string} encryptionKey - 32-character encryption key
 * @returns {Buffer} - Decrypted file buffer
 */
exports.decryptFile = (encryptedBuffer, encryptionKey) => {
    try {
        // Extract IV from the beginning of the encrypted data
        const iv = encryptedBuffer.slice(0, 16);
        const encrypted = encryptedBuffer.slice(16);

        // Create decipher
        const decipher = crypto.createDecipheriv(
            ALGORITHM,
            Buffer.from(encryptionKey, 'utf-8'),
            iv
        );

        // Decrypt the buffer
        const decryptedData = Buffer.concat([
            decipher.update(encrypted),
            decipher.final()
        ]);

        return decryptedData;
    } catch (error) {
        throw new Error('Decryption failed: ' + error.message);
    }
};

/**
 * Generate secure random token for share links
 * @param {number} length - Token length in bytes (default: 32)
 * @returns {string} - Random token in hex format
 */
exports.generateSecureToken = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};
