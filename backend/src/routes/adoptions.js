const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Public/User routes
router.post('/', authMiddleware, adoptionController.createRequest);
router.get('/my', authMiddleware, adoptionController.getMyRequests);
router.get('/:id', authMiddleware, adoptionController.getRequestById);

// Admin/Shelter routes
router.get('/', authMiddleware, adminMiddleware, adoptionController.getAllRequests);
router.put('/:id/status', authMiddleware, adminMiddleware, adoptionController.updateStatus);

module.exports = router;
