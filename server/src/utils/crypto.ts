// server/src/utils/crypto.ts
// Encryption/Decryption Utility for Sensitive Data

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

/**
 * Crypto Service for encrypting/decrypting sensitive data
 */
export class CryptoService {
    private encryptionKey: Buffer;

    constructor(key?: string) {
        const envKey = key || process.env.ENCRYPTION_KEY;

        if (!envKey) {
            throw new Error('Encryption key not configured');
        }

        // Derive a key from the provided key
        this.encryptionKey = crypto.scryptSync(envKey, 'salt', KEY_LENGTH);
    }

    /**
     * Encrypt a string value
     * Returns base64-encoded string: IV:AuthTag:EncryptedData
     */
    encrypt(plaintext: string): string {
        if (!plaintext) {
            throw new Error('Cannot encrypt empty value');
        }

        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, this.encryptionKey, iv);

        let encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        // Combine IV + AuthTag + EncryptedData
        const combined = Buffer.concat([
            iv,
            authTag,
            Buffer.from(encrypted, 'hex')
        ]);

        return combined.toString('base64');
    }

    /**
     * Decrypt an encrypted string
     */
    decrypt(encryptedValue: string): string {
        if (!encryptedValue) {
            throw new Error('Cannot decrypt empty value');
        }

        try {
            const combined = Buffer.from(encryptedValue, 'base64');

            const iv = combined.subarray(0, IV_LENGTH);
            const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
            const encrypted = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

            const decipher = crypto.createDecipheriv(ALGORITHM, this.encryptionKey, iv);
            decipher.setAuthTag(authTag);

            let decrypted = decipher.update(encrypted);
            decrypted = Buffer.concat([decrypted, decipher.final()]);

            return decrypted.toString('utf8');
        } catch (error) {
            throw new Error('Decryption failed: Invalid or corrupted data');
        }
    }

    /**
     * Hash a password using bcrypt-like approach
     */
    static async hashPassword(password: string): Promise<string> {
        const salt = crypto.randomBytes(SALT_LENGTH);
        const hash = await new Promise<Buffer>((resolve, reject) => {
            crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, 'sha512', (err, key) => {
                if (err) reject(err);
                else resolve(key);
            });
        });

        return `${salt.toString('hex')}:${hash.toString('hex')}`;
    }

    /**
     * Verify a password against a hash
     */
    static async verifyPassword(password: string, storedHash: string): Promise<boolean> {
        const [saltHex, hashHex] = storedHash.split(':');
        const salt = Buffer.from(saltHex, 'hex');
        const storedHashBuffer = Buffer.from(hashHex, 'hex');

        const hash = await new Promise<Buffer>((resolve, reject) => {
            crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, 'sha512', (err, key) => {
                if (err) reject(err);
                else resolve(key);
            });
        });

        return crypto.timingSafeEqual(hash, storedHashBuffer);
    }

    /**
     * Generate a random token
     */
    static generateToken(length: number = 32): string {
        return crypto.randomBytes(length).toString('hex');
    }

    /**
     * Generate a short random ID
     */
    static generateId(prefix: string = ''): string {
        const timestamp = Date.now().toString(36);
        const random = crypto.randomBytes(6).toString('hex');
        return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
    }

    /**
     * Create HMAC signature
     */
    static createSignature(data: string, secret: string): string {
        return crypto
            .createHmac('sha256', secret)
            .update(data)
            .digest('hex');
    }

    /**
     * Verify HMAC signature
     */
    static verifySignature(data: string, signature: string, secret: string): boolean {
        const expectedSignature = CryptoService.createSignature(data, secret);
        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );
    }
}

export default CryptoService;
