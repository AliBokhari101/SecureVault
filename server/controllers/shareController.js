const bcrypt = require('bcrypt');
const fs = require('fs');
const db = require('../config/db.js');
const { generateSecureToken } = require('../utils/encryption.js');
const { asyncHandler } = require('../middleware/errorHandler.js');
const { logActivity, getClientIp } = require('../utils/logger.js');
const { decryptFile } = require('../utils/encryption.js');

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

/**
 * Create share link for file
 * POST /api/share/create
 */
exports.createShareLink = asyncHandler(async (req, res) => {
    const { fileId, expiresIn, password } = req.body;
    const userId = req.user.id;

    // Verify file ownership
    const file = db.prepare('SELECT id, file_name, user_id FROM files WHERE id = ?').get(fileId);

    if (!file) {
        return res.status(404).json({
            success: false,
            error: 'File not found'
        });
    }

    if (file.user_id !== userId) {
        return res.status(403).json({
            success: false,
            error: 'Not authorized to share this file'
        });
    }

    // Generate secure token
    const token = generateSecureToken();

    // Calculate expiration (default: 7 days)
    const expirationHours = expiresIn || 168;
    const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000).toISOString();

    // Hash password if provided
    let passwordHash = null;
    if (password) {
        passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    }

    // Create share link
    const stmt = db.prepare('INSERT INTO shared_links (file_id, token, expires_at, password_hash) VALUES (?, ?, ?, ?)');
    const result = stmt.run(fileId, token, expiresAt, passwordHash);

    const shareLink = db.prepare('SELECT id, token, expires_at FROM shared_links WHERE id = ?').get(result.lastInsertRowid);

    // Log activity
    await logActivity(userId, `Created share link for file: ${file.file_name}`, getClientIp(req));

    res.status(201).json({
        success: true,
        message: 'Share link created successfully',
        shareLink: {
            token: shareLink.token,
            expiresAt: shareLink.expires_at,
            hasPassword: !!password,
            url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/share/${shareLink.token}`
        }
    });
});

/**
 * Access shared file (validate token and password)
 * POST /api/share/:token/access
 */
exports.accessSharedFile = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    // Get share link
    const shareLink = db.prepare(`
        SELECT sl.id, sl.file_id, sl.expires_at, sl.password_hash, sl.download_count,
            f.file_name, f.file_size, f.uploaded_at
        FROM shared_links sl
        JOIN files f ON sl.file_id = f.id
        WHERE sl.token = ?
    `).get(token);

    if (!shareLink) {
        return res.status(404).json({
            success: false,
            error: 'Share link not found or expired'
        });
    }

    // Check expiration
    if (new Date(shareLink.expires_at) < new Date()) {
        return res.status(410).json({
            success: false,
            error: 'Share link has expired'
        });
    }

    // Verify password if required
    if (shareLink.password_hash) {
        if (!password) {
            return res.status(401).json({
                success: false,
                error: 'Password required',
                requiresPassword: true
            });
        }

        const isPasswordValid = await bcrypt.compare(password, shareLink.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid password'
            });
        }
    }

    // Return file info
    res.json({
        success: true,
        file: {
            id: shareLink.file_id,
            name: shareLink.file_name,
            size: shareLink.file_size,
            uploadedAt: shareLink.uploaded_at,
            downloadCount: shareLink.download_count
        }
    });
});

/**
 * Download shared file
 * GET /api/share/:token/download
 */
exports.downloadSharedFile = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.query;

    // Get share link and file info
    const shareData = db.prepare(`
        SELECT sl.id as share_id, sl.expires_at, sl.password_hash,
            f.file_name, f.file_path, f.encryption_key
        FROM shared_links sl
        JOIN files f ON sl.file_id = f.id
        WHERE sl.token = ?
    `).get(token);

    if (!shareData) {
        return res.status(404).json({
            success: false,
            error: 'Share link not found'
        });
    }

    // Check expiration
    if (new Date(shareData.expires_at) < new Date()) {
        return res.status(410).json({
            success: false,
            error: 'Share link has expired'
        });
    }

    // Verify password if required
    if (shareData.password_hash) {
        if (!password) {
            return res.status(401).json({
                success: false,
                error: 'Password required'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, shareData.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid password'
            });
        }
    }

    // Read and decrypt file
    const encryptedBuffer = fs.readFileSync(shareData.file_path);
    const decryptedBuffer = decryptFile(encryptedBuffer, shareData.encryption_key);

    // Increment download count
    db.prepare('UPDATE shared_links SET download_count = download_count + 1 WHERE id = ?').run(shareData.share_id);

    // Log activity (anonymous)
    await logActivity(null, `Downloaded shared file: ${shareData.file_name}`, getClientIp(req));

    // Send file
    res.setHeader('Content-Disposition', `attachment; filename="${shareData.file_name}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(decryptedBuffer);
});

/**
 * Get user's share links
 * GET /api/share/my-links
 */
exports.getMyShareLinks = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const links = db.prepare(`
        SELECT sl.id, sl.token, sl.expires_at, sl.download_count, sl.created_at,
            f.file_name, f.file_size,
            CASE WHEN sl.password_hash IS NOT NULL THEN 1 ELSE 0 END as has_password
        FROM shared_links sl
        JOIN files f ON sl.file_id = f.id
        WHERE f.user_id = ?
        ORDER BY sl.created_at DESC
    `).all(userId);

    res.json({
        success: true,
        count: links.length,
        links: links.map(link => ({
            ...link,
            has_password: !!link.has_password,
            url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/share/${link.token}`
        }))
    });
});

/**
 * Delete share link
 * DELETE /api/share/:id
 */
exports.deleteShareLink = asyncHandler(async (req, res) => {
    const linkId = req.params.id;
    const userId = req.user.id;

    // Verify ownership
    const link = db.prepare(`
        SELECT sl.id, f.user_id 
        FROM shared_links sl
        JOIN files f ON sl.file_id = f.id
        WHERE sl.id = ?
    `).get(linkId);

    if (!link) {
        return res.status(404).json({
            success: false,
            error: 'Share link not found'
        });
    }

    if (link.user_id !== userId) {
        return res.status(403).json({
            success: false,
            error: 'Not authorized to delete this share link'
        });
    }

    db.prepare('DELETE FROM shared_links WHERE id = ?').run(linkId);

    res.json({
        success: true,
        message: 'Share link deleted successfully'
    });
});
