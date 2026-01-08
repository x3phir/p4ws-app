const prisma = require('../config/database');
const notificationController = require('./notificationController');

exports.createDonation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { campaignId, amount } = req.body;
        const file = req.file;
        const donationAmount = parseFloat(amount);

        if (!file) {
            return res.status(400).json({ error: 'Proof of payment is required' });
        }

        // Generate URL
        const proofUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

        const donation = await prisma.donation.create({
            data: {
                userId,
                campaignId,
                amount: donationAmount,
                proofUrl,
                status: 'PENDING'
            }
        });

        // Create notification for user
        await notificationController.createNotification(
            userId,
            'Donasi Terkirim',
            `Donasi Anda sebesar Rp ${donationAmount.toLocaleString()} telah terkirim dan sedang menunggu verifikasi admin.`,
            'DONATION_CREATED'
        );
        console.log(donation.id);

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

        console.log(`Updating donation ${id} to status: ${status}`);

        const updatedDonation = await prisma.$transaction(async (tx) => {
            const currentDonation = await tx.donation.findUnique({ where: { id } });
            if (!currentDonation) throw new Error('Donation not found');

            console.log(`Current donation status: ${currentDonation.status}`);

            if (currentDonation.status === status) return currentDonation;

            const donation = await tx.donation.update({
                where: { id },
                data: { status }
            });

            // If moving from non-VERIFIED to VERIFIED, increment
            if (status === 'VERIFIED' && currentDonation.status !== 'VERIFIED') {
                console.log(`Incrementing campaign ${donation.campaignId} by ${donation.amount}`);

                const updatedCampaign = await tx.campaign.update({
                    where: { id: donation.campaignId },
                    data: {
                        currentAmount: { increment: donation.amount }
                    }
                });

                // Check if target reached
                if (updatedCampaign.currentAmount >= updatedCampaign.targetAmount) {
                    await tx.campaign.update({
                        where: { id: donation.campaignId },
                        data: { status: 'COMPLETED' }
                    });
                }
            }

            // If moving from VERIFIED to REJECTED (or PENDING?), decrement
            if (status !== 'VERIFIED' && currentDonation.status === 'VERIFIED') {
                console.log(`Decrementing campaign ${donation.campaignId} by ${donation.amount}`);

                const updatedCampaign = await tx.campaign.update({
                    where: { id: donation.campaignId },
                    data: {
                        currentAmount: { decrement: donation.amount }
                    }
                });

                // If amount drops below target, make it ACTIVE again
                if (updatedCampaign.currentAmount < updatedCampaign.targetAmount) {
                    await tx.campaign.update({
                        where: { id: donation.campaignId },
                        data: { status: 'ACTIVE' }
                    });
                }
            }

            return donation;
        });

        // Create notification for user
        await notificationController.createNotification(
            updatedDonation.userId,
            status === 'VERIFIED' ? 'Donasi Terverifikasi' : 'Donasi Ditolak',
            status === 'VERIFIED'
                ? `Donasi Anda sebesar Rp ${updatedDonation.amount.toLocaleString()} telah terverifikasi. Terima kasih!`
                : `Maaf, donasi Anda tidak dapat kami verifikasi. Jumlah donasi telah disesuaikan kembali.`,
            'DONATION_UPDATE'
        );

        res.json(updatedDonation);
    } catch (error) {
        console.error("Error updating donation status:", error);
        res.status(500).json({ error: error.message });
    }
};
