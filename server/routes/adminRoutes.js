const express = require('express');
const { getAllUsers, getAllFiles, getActivityLogs, getSystemStats } = require('../controllers/adminController.js');
const { protect, authorize } = require('../middleware/authMiddleware.js');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Admin routes
router.get('/users', getAllUsers);
router.get('/files', getAllFiles);
router.get('/logs', getActivityLogs);
router.get('/stats', getSystemStats);

module.exports = router;
