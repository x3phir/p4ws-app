const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware } = require('../middleware/auth');

const upload = require('../middleware/upload');

router.get('/', authMiddleware, reportController.getAllReports);
router.get('/:id', authMiddleware, reportController.getReportById);
router.post('/', authMiddleware, upload.single('image'), reportController.createReport);
router.put('/:id/status', authMiddleware, reportController.updateReportStatus);
router.post('/:id/timeline', authMiddleware, reportController.addTimelineEntry);

module.exports = router;
