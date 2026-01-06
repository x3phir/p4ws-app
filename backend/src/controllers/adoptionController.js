const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create new adoption request
exports.createRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { petId, reason, hasYard, hasOtherPets, contact } = req.body;

        // Check if pet exists and is available
        const pet = await prisma.pet.findUnique({ where: { id: petId } });
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        if (pet.status !== 'AVAILABLE') {
            return res.status(400).json({ error: 'Pet is not available for adoption' });
        }

        // Check if user already has pending request for this pet
        const existing = await prisma.adoptionRequest.findFirst({
            where: {
                userId,
                petId,
                status: 'PENDING'
            }
        });

        if (existing) {
            return res.status(400).json({ error: 'You already have a pending request for this pet' });
        }

        const adoption = await prisma.adoptionRequest.create({
            data: {
                userId,
                petId,
                reason,
                hasYard,
                hasOtherPets,
                contact,
                status: 'PENDING'
            }
        });
        res.status(201).json(adoption);
    } catch (error) {
        console.error("Create adoption error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get current user's requests
exports.getMyRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const requests = await prisma.adoptionRequest.findMany({
            where: { userId },
            include: {
                pet: {
                    include: { shelter: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: Get all requests
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await prisma.adoptionRequest.findMany({
            include: {
                pet: { include: { shelter: true } },
                user: { select: { name: true, email: true, phone: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get request by ID
exports.getRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await prisma.adoptionRequest.findUnique({
            where: { id },
            include: {
                pet: { include: { shelter: true } },
                user: { select: { name: true, email: true, phone: true } }
            }
        });

        if (!request) return res.status(404).json({ error: 'Request not found' });

        // Allow user to see their own, or admin
        if (request.userId !== req.user.id && req.user.role !== 'ADMIN' && req.user.role !== 'SHELTER_STAFF') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        res.json(request);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: Update status
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNote } = req.body;

        const updated = await prisma.adoptionRequest.update({
            where: { id },
            data: { status, adminNote }
        });

        // If completed, update pet status to ADOPTED
        if (status === 'COMPLETED') {
            await prisma.pet.update({
                where: { id: updated.petId },
                data: { status: 'ADOPTED' }
            });
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
