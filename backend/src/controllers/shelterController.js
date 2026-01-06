const prisma = require('../config/database');

// Get all shelters
exports.getAllShelters = async (req, res) => {
    try {
        const shelters = await prisma.shelter.findMany({
            include: {
                _count: {
                    select: { pets: true, reports: true }
                }
            }
        });
        res.json(shelters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get shelter by ID
exports.getShelterById = async (req, res) => {
    try {
        const { id } = req.params;
        const shelter = await prisma.shelter.findUnique({
            where: { id },
            include: {
                pets: true,
                campaigns: true,
                _count: {
                    select: { reports: true }
                }
            }
        });

        if (!shelter) {
            return res.status(404).json({ error: 'Shelter not found' });
        }

        res.json(shelter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create shelter (Admin only)
exports.createShelter = async (req, res) => {
    try {
        const { name, description, address, phone, email, capacity, imageUrl } = req.body;

        const shelter = await prisma.shelter.create({
            data: {
                name,
                description,
                address,
                phone,
                email,
                capacity: parseInt(capacity),
                imageUrl
            }
        });

        res.status(201).json(shelter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update shelter
exports.updateShelter = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const shelter = await prisma.shelter.update({
            where: { id },
            data
        });

        res.json(shelter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete shelter
exports.deleteShelter = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.shelter.delete({ where: { id } });
        res.json({ message: 'Shelter deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
