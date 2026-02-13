const { body, param, validationResult } = require('express-validator');

/**
 * Validation middleware to check for errors
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

/**
 * Registration validation rules
 */
exports.registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 255 }).withMessage('Name must be 2-255 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),

    validate
];

/**
 * Login validation rules
 */
exports.loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required'),

    validate
];

/**
 * Share link creation validation
 */
exports.shareValidation = [
    body('fileId')
        .notEmpty().withMessage('File ID is required')
        .isInt({ min: 1 }).withMessage('Invalid file ID'),

    body('expiresIn')
        .optional()
        .isInt({ min: 1 }).withMessage('Expiration must be positive number'),

    body('password')
        .optional()
        .isLength({ min: 4 }).withMessage('Password must be at least 4 characters'),

    validate
];

/**
 * File ID parameter validation
 */
exports.fileIdValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('Invalid file ID'),

    validate
];

/**
 * Token parameter validation
 */
exports.tokenValidation = [
    param('token')
        .notEmpty().withMessage('Token is required')
        .isLength({ min: 32, max: 128 }).withMessage('Invalid token format'),

    validate
];
