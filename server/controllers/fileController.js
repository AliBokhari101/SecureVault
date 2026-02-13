const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/db.js');
const { encryptFile, decryptFile } = require('../utils/encryption.js');
const { asyncHandler } = require('../middleware/errorHandler.js');
const { logActivity, getClientIp } = require('../utils/logger.js');

const UPLOAD_DIR = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024; // 50MB

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Allowed file types
const ALLOWED_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'text/csv',
    'application/zip', 'application/x-rar-compressed'
];

// Configure multer for file upload
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE
    },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`File type ${file.mimetype} is not allowed`), false);
        }
    }
});

/**
 * Upload and encrypt file
 * POST /api/files/upload
 */
exports.uploadFile = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            error: 'No file uploaded'
        });
    }

    const { originalname, buffer, size } = req.file;
    const userId = req.user.id;

    // Encrypt file
    const { encryptedData, encryptionKey } = encryptFile(buffer);

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const encryptedFileName = `${timestamp}_${sanitizedName}.enc`;
    const filePath = path.join(UPLOAD_DIR, encryptedFileName);

    // Save encrypted file to disk
    fs.writeFileSync(filePath, encryptedData);

    // Save file metadata to database
    const stmt = db.prepare('INSERT INTO files (user_id, file_name, file_path, file_size, encryption_key) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(userId, originalname, filePath, size, encryptionKey);

    const fileRecord = db.prepare('SELECT id, file_name, file_size, uploaded_at FROM files WHERE id = ?').get(result.lastInsertRowid);

    // Log activity
    await logActivity(userId, `Uploaded file: ${originalname}`, getClientIp(req));

    res.status(201).json({
        success: true,
        message: 'File uploaded and encrypted successfully',
        file: fileRecord
    });
});

/**
 * Get user's files
 * GET /api/files
 */
exports.getFiles = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const files = db.prepare('SELECT id, file_name, file_size, uploaded_at FROM files WHERE user_id = ? ORDER BY uploaded_at DESC').all(userId);

    res.json({
        success: true,
        count: files.length,
        files
    });
});

/**
 * Download and decrypt file
 * GET /api/files/:id/download
 */
exports.downloadFile = asyncHandler(async (req, res) => {
    const fileId = req.params.id;
    const userId = req.user.id;

    // Get file metadata
    const file = db.prepare('SELECT file_name, file_path, encryption_key, user_id FROM files WHERE id = ?').get(fileId);

    if (!file) {
        return res.status(404).json({
            success: false,
            error: 'File not found'
        });
    }

    // Check ownership
    if (file.user_id !== userId) {
        return res.status(403).json({
            success: false,
            error: 'Not authorized to download this file'
        });
    }

    // Read encrypted file
    const encryptedBuffer = fs.readFileSync(file.file_path);

    // Decrypt file
    const decryptedBuffer = decryptFile(encryptedBuffer, file.encryption_key);

    // Log activity
    await logActivity(userId, `Downloaded file: ${file.file_name}`, getClientIp(req));

    // Send file
    res.setHeader('Content-Disposition', `attachment; filename="${file.file_name}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(decryptedBuffer);
});

/**
 * Delete file
 * DELETE /api/files/:id
 */
exports.deleteFile = asyncHandler(async (req, res) => {
    const fileId = req.params.id;
    const userId = req.user.id;

    // Get file metadata
    const file = db.prepare('SELECT file_name, file_path, user_id FROM files WHERE id = ?').get(fileId);

    if (!file) {
        return res.status(404).json({
            success: false,
            error: 'File not found'
        });
    }

    // Check ownership
    if (file.user_id !== userId) {
        return res.status(403).json({
            success: false,
            error: 'Not authorized to delete this file'
        });
    }

    // Delete file from disk
    if (fs.existsSync(file.file_path)) {
        fs.unlinkSync(file.file_path);
    }

    // Delete from database (cascade will delete shared links)
    db.prepare('DELETE FROM files WHERE id = ?').run(fileId);

    // Log activity
    await logActivity(userId, `Deleted file: ${file.file_name}`, getClientIp(req));

    res.json({
        success: true,
        message: 'File deleted successfully'
    });
});


// Export multer middleware
exports.upload = upload;

