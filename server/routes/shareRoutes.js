const express = require('express');
const { createShareLink, accessSharedFile, downloadSharedFile, getMyShareLinks, deleteShareLink } = require('../controllers/shareController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

// Public routes (no authentication required)
router.post('/:token/access', accessSharedFile);
router.get('/:token/download', downloadSharedFile);

// Protected routes (require authentication)
router.post('/create', protect, createShareLink);
router.get('/my-links', protect, getMyShareLinks);
router.delete('/:id', protect, deleteShareLink);

module.exports = router;
