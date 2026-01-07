// backend/src/routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

// User routes
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, upload.single('avatar'), userController.updateProfile);
router.put('/password', authMiddleware, userController.changePassword);

// Verification routes
router.post('/verification', authMiddleware, upload.single('ktp'), userController.submitVerification);

// Admin routes
router.get('/verification-requests', authMiddleware, adminMiddleware, userController.getVerificationRequests);
router.put('/verification/:id', authMiddleware, adminMiddleware, userController.updateVerificationStatus);

module.exports = router;