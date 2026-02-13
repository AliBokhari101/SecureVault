const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db.js');
const { asyncHandler } = require('../middleware/errorHandler.js');
const { logActivity, getClientIp } = require('../utils/logger.js');

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;
const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
const LOCK_TIME = parseInt(process.env.LOCK_TIME) || 15 * 60 * 1000; // 15 minutes

/**
 * Register new user
 * POST /api/auth/register
 */
exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

    if (existingUser) {
        return res.status(409).json({
            success: false,
            error: 'User with this email already exists'
        });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Create user
    const stmt = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
    const result = stmt.run(name, email, passwordHash);

    const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);

    // Log activity
    await logActivity(user.id, 'User registered', getClientIp(req));

    // Generate JWT token
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

/**
 * Login user
 * POST /api/auth/login
 */
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Get user
    const user = db.prepare('SELECT id, name, email, password_hash, role, failed_attempts, lock_until FROM users WHERE email = ?').get(email);

    if (!user) {
        return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
        });
    }

    // Check if account is locked
    if (user.lock_until && new Date(user.lock_until) > new Date()) {
        const remainingTime = Math.ceil((new Date(user.lock_until) - new Date()) / 1000 / 60);
        return res.status(423).json({
            success: false,
            error: `Account is locked. Try again in ${remainingTime} minutes.`,
            locked: true,
            remainingTime
        });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
        // Increment failed attempts
        const newFailedAttempts = user.failed_attempts + 1;
        let lockUntil = null;

        if (newFailedAttempts >= MAX_LOGIN_ATTEMPTS) {
            lockUntil = new Date(Date.now() + LOCK_TIME).toISOString();
            await logActivity(user.id, 'Account locked due to failed login attempts', getClientIp(req));
        }

        db.prepare('UPDATE users SET failed_attempts = ?, lock_until = ? WHERE id = ?')
            .run(newFailedAttempts, lockUntil, user.id);

        if (lockUntil) {
            return res.status(423).json({
                success: false,
                error: 'Too many failed attempts. Account locked for 15 minutes.',
                locked: true
            });
        }

        return res.status(401).json({
            success: false,
            error: 'Invalid credentials',
            attemptsRemaining: MAX_LOGIN_ATTEMPTS - newFailedAttempts
        });
    }

    // Reset failed attempts on successful login
    db.prepare('UPDATE users SET failed_attempts = 0, lock_until = NULL WHERE id = ?')
        .run(user.id);

    // Log activity
    await logActivity(user.id, 'User logged in', getClientIp(req));

    // Generate JWT token
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

/**
 * Get current user profile
 * GET /api/auth/me
 */
exports.getProfile = asyncHandler(async (req, res) => {
    const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.user.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }

    res.json({
        success: true,
        user
    });
});
