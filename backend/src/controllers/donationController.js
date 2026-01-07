const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const notificationController = require('./notificationController');

exports.createDonation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { campaignId, amount } = req.body;
        const file = req.file;
        console.log(req.file);
        console.log(userId);
        console.log(req.body);

        if (!file) {
            console.log("kena eror");
            return res.status(400).json({ error: 'Proof of payment is required' });
        }

        // Generate URL
        const proofUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

        const donation = await prisma.donation.create({
            data: {
                userId,
                campaignId,
                amount: parseFloat(amount),
                proofUrl,
                status: 'PENDING'
            }
        });

        // Create notification for user
        await notificationController.createNotification(
            userId,
            'Donasi Terkirim',
            `Donasi Anda sebesar Rp ${parseFloat(amount).toLocaleString()} telah terkirim dan sedang menunggu verifikasi.`,
            'DONATION_CREATED'
        );

        res.status(201).json(donation);
    } catch (error) {
        console.error("Donation error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getMyDonations = async (req, res) => {
    try {
        const userId = req.user.id;
        const donations = await prisma.donation.findMany({
            where: { userId },
            include: {
                campaign: {
                    include: { shelter: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: Get All
exports.getAllDonations = async (req, res) => {
    try {
        const donations = await prisma.donation.findMany({
            include: {
                campaign: true,
                user: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: Verify
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // VERIFIED, REJECTED

        // Check current status to prevent double counting
        const currentDonation = await prisma.donation.findUnique({ where: { id } });
        if (!currentDonation) return res.status(404).json({ error: 'Donation not found' });

        if (currentDonation.status === 'VERIFIED' && status === 'VERIFIED') {
            return res.status(400).json({ error: 'Donation already verified' });
        }

        const donation = await prisma.donation.update({
            where: { id },
            data: { status }
        });

        // If verified, update campaign amount
        // NOTE: If status changed from VERIFIED to REJECTED, we should decrement? 
        // For simplicity, assumed we only move PENDING -> VERIFIED or REJECTED.
        if (status === 'VERIFIED' && currentDonation.status !== 'VERIFIED') {
            await prisma.campaign.update({
                where: { id: donation.campaignId },
                data: {
                    currentAmount: { increment: donation.amount }
                }
            });
        }

        // Create notification for user
        await notificationController.createNotification(
            donation.userId,
            status === 'VERIFIED' ? 'Donasi Terverifikasi' : 'Donasi Ditolak',
            status === 'VERIFIED'
                ? `Donasi Anda sebesar Rp ${donation.amount.toLocaleString()} telah terverifikasi. Terima kasih!`
                : `Maaf, donasi Anda tidak dapat kami verifikasi.`,
            'DONATION_UPDATE'
        );

        res.json(donation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
