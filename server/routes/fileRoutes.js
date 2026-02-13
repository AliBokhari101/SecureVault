const express = require('express');
const { uploadFile, getFiles, downloadFile, deleteFile, upload } = require('../controllers/fileController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

// All routes require authentication
router.use(protect);

// File routes
router.post('/upload', upload.single('file'), uploadFile);
router.get('/', getFiles);
router.get('/:id/download', downloadFile);
router.delete('/:id', deleteFile);

module.exports = router;
