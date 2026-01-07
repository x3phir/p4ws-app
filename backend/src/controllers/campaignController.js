const prisma = require('../config/database');

// Get all campaigns
exports.getAllCampaigns = async (req, res) => {
    try {
        const { status, shelterId } = req.query;

        const where = {};
        if (status) where.status = status;
        if (shelterId) where.shelterId = shelterId;
        if (req.query.isUrgent !== undefined) where.isUrgent = req.query.isUrgent === 'true';

        const campaigns = await prisma.campaign.findMany({
            where,
            include: {
                shelter: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get campaign by ID
exports.getCampaignById = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await prisma.campaign.findUnique({
            where: { id },
            include: {
                shelter: true
            }
        });

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        res.json(campaign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCampaign = async (req, res) => {
    try {
        const { title, description, imageUrl, targetAmount, shelterId, isUrgent } = req.body;

        const campaign = await prisma.campaign.create({
            data: {
                title,
                description,
                imageUrl,
                targetAmount: parseFloat(targetAmount),
                shelterId,
                isUrgent: isUrgent === true || isUrgent === 'true'
            },
            include: {
                shelter: true
            }
        });

        res.status(201).json(campaign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update campaign
exports.updateCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (data.targetAmount) data.targetAmount = parseFloat(data.targetAmount);
        if (data.currentAmount) data.currentAmount = parseFloat(data.currentAmount);

        const campaign = await prisma.campaign.update({
            where: { id },
            data,
            include: {
                shelter: true
            }
        });

        res.json(campaign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Process donation
exports.processDonation = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        const campaign = await prisma.campaign.findUnique({ where: { id } });

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        const newAmount = campaign.currentAmount + parseFloat(amount);
        const updatedCampaign = await prisma.campaign.update({
            where: { id },
            data: {
                currentAmount: newAmount,
                status: newAmount >= campaign.targetAmount ? 'COMPLETED' : campaign.status
            },
            include: {
                shelter: true
            }
        });

        res.json(updatedCampaign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
