const db = require('../config/db.js');
const { asyncHandler } = require('../middleware/errorHandler.js');

/**
 * Get all users (admin only)
 * GET /api/admin/users
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = db.prepare(`
        SELECT id, name, email, role, failed_attempts, lock_until, created_at 
        FROM users 
        ORDER BY created_at DESC
    `).all();

    res.json({
        success: true,
        count: users.length,
        users
    });
});

/**
 * Get all files (admin only)
 * GET /api/admin/files
 */
exports.getAllFiles = asyncHandler(async (req, res) => {
    const files = db.prepare(`
        SELECT f.id, f.file_name, f.file_size, f.uploaded_at,
            u.name as owner_name, u.email as owner_email
        FROM files f
        JOIN users u ON f.user_id = u.id
        ORDER BY f.uploaded_at DESC
    `).all();

    res.json({
        success: true,
        count: files.length,
        files
    });
});

/**
 * Get activity logs (admin only)
 * GET /api/admin/logs
 */
exports.getActivityLogs = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const logs = db.prepare(`
        SELECT al.id, al.action, al.ip_address, al.timestamp,
            u.name as user_name, u.email as user_email
        FROM activity_logs al
        LEFT JOIN users u ON al.user_id = u.id
        ORDER BY al.timestamp DESC
        LIMIT ? OFFSET ?
    `).all(limit, offset);

    const totalCount = db.prepare('SELECT COUNT(*) as count FROM activity_logs').get().count;

    res.json({
        success: true,
        count: logs.length,
        total: totalCount,
        logs
    });
});

/**
 * Get system statistics (admin only)
 * GET /api/admin/stats
 */
exports.getSystemStats = asyncHandler(async (req, res) => {
    // Get user count
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;

    // Get file count and total size
    const fileStats = db.prepare('SELECT COUNT(*) as count, SUM(file_size) as total_size FROM files').get();

    // Get share link count
    const linkCount = db.prepare('SELECT COUNT(*) as count FROM shared_links').get().count;

    // Get recent activity count (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const recentActivity = db.prepare('SELECT COUNT(*) as count FROM activity_logs WHERE timestamp > ?').get(oneDayAgo).count;

    res.json({
        success: true,
        stats: {
            totalUsers: userCount,
            totalFiles: fileStats.count,
            totalStorage: fileStats.total_size || 0,
            totalShareLinks: linkCount,
            recentActivity
        }
    });
});
