const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

// User routes
router.post('/', authMiddleware, upload.single('proof'), donationController.createDonation);
router.get('/my', authMiddleware, donationController.getMyDonations);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, donationController.getAllDonations);
router.put('/:id/status', authMiddleware, adminMiddleware, donationController.updateStatus);

module.exports = router;
