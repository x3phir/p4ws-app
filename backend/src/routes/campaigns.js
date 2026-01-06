const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', campaignController.getAllCampaigns);
router.get('/:id', campaignController.getCampaignById);
router.post('/', authMiddleware, campaignController.createCampaign);
router.put('/:id', authMiddleware, campaignController.updateCampaign);
router.post('/:id/donate', campaignController.processDonation);

module.exports = router;
