const express = require('express');
const { register, login, getProfile } = require('../controllers/authController.js');
const { registerValidation, loginValidation } = require('../middleware/validation.js');
const { protect } = require('../middleware/authMiddleware.js');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiter for login route
const loginLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 5,
    message: {
        success: false,
        error: 'Too many login attempts. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginLimiter, loginValidation, login);

// Protected routes
router.get('/me', protect, getProfile);

module.exports = router;
