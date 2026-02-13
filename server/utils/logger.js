const db = require('../config/db.js');

/**
 * Log user activity
 * @param {number} userId - User ID
 * @param {string} action - Action description
 * @param {string} ipAddress - IP address
 * @param {string} userAgent - User agent string
 */
const logActivity = async (userId, action, ipAddress, userAgent = null) => {
    try {
        const stmt = db.prepare('INSERT INTO activity_logs (user_id, action, ip_address, user_agent) VALUES (?, ?, ?, ?)');
        stmt.run(userId, action, ipAddress, userAgent);
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};

/**
 * Get client IP address from request
 * @param {Object} req - Express request object
 * @returns {string} IP address
 */
const getClientIp = (req) => {
    return req.headers['x-forwarded-for']?.split(',')[0] ||
        req.headers['x-real-ip'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        'unknown';
};

module.exports = {
    logActivity,
    getClientIp
};
