const prisma = require('../config/database');

// Get all pets
exports.getAllPets = async (req, res) => {
    try {
        const { status, shelterId } = req.query;

        const where = {};
        if (status) where.status = status;
        if (shelterId) where.shelterId = shelterId;

        const pets = await prisma.pet.findMany({
            where,
            include: {
                shelter: {
                    select: {
                        id: true,
                        name: true,
                        address: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get pet by ID
exports.getPetById = async (req, res) => {
    try {
        const { id } = req.params;
        const pet = await prisma.pet.findUnique({
            where: { id },
            include: {
                shelter: true
            }
        });

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        res.json(pet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create pet
exports.createPet = async (req, res) => {
    try {
        const { name, description, about, imageUrl, age, gender, breed, vaccine, steril, shelterId } = req.body;

        const pet = await prisma.pet.create({
            data: {
                name,
                description,
                about,
                imageUrl,
                age,
                gender,
                breed,
                vaccine,
                steril,
                shelterId
            },
            include: {
                shelter: true
            }
        });

        res.status(201).json(pet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update pet
exports.updatePet = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const pet = await prisma.pet.update({
            where: { id },
            data,
            include: {
                shelter: true
            }
        });

        res.json(pet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete pet
exports.deletePet = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.pet.delete({ where: { id } });
        res.json({ message: 'Pet deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
