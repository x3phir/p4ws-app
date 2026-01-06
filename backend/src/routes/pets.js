const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', petController.getAllPets);
router.get('/:id', petController.getPetById);
router.post('/', authMiddleware, petController.createPet);
router.put('/:id', authMiddleware, petController.updatePet);
router.delete('/:id', authMiddleware, petController.deletePet);

module.exports = router;
