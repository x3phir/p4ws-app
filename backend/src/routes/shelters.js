const express = require('express');
const router = express.Router();
const shelterController = require('../controllers/shelterController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', shelterController.getAllShelters);
router.get('/:id', shelterController.getShelterById);
router.post('/', authMiddleware, adminMiddleware, shelterController.createShelter);
router.put('/:id', authMiddleware, adminMiddleware, shelterController.updateShelter);
router.delete('/:id', authMiddleware, adminMiddleware, shelterController.deleteShelter);

module.exports = router;
