// backend/src/controllers/userController.js
const bcrypt = require('bcryptjs');
const prisma = require('../config/database');

// Get current user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                avatar: true,
                role: true,
                isVerified: true,
                verificationStatus: true,
                ktpImageUrl: true,
                verificationNote: true,
                verifiedAt: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, email } = req.body;
        const avatar = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : undefined;

        // Check if email is already taken by another user
        if (email && email !== req.user.email) {
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({ error: 'Email already in use' });
            }
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (email) updateData.email = email;
        if (avatar) updateData.avatar = avatar;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                avatar: true,
                role: true,
                isVerified: true,
                verificationStatus: true,
                createdAt: true
            }
        });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }

        // Get user with password
        const user = await prisma.user.findUnique({ where: { id: userId } });
        
        // Verify current password
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Submit verification request
exports.submitVerification = async (req, res) => {
    try {
        const userId = req.user.id;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'KTP image is required' });
        }

        // Check current verification status
        const user = await prisma.user.findUnique({ where: { id: userId } });
        
        if (user.verificationStatus === 'VERIFIED') {
            return res.status(400).json({ error: 'Your account is already verified' });
        }

        if (user.verificationStatus === 'PENDING') {
            return res.status(400).json({ error: 'Your verification is already pending review' });
        }

        const ktpImageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ktpImageUrl,
                verificationStatus: 'PENDING',
                verificationNote: null
            },
            select: {
                id: true,
                email: true,
                name: true,
                verificationStatus: true,
                ktpImageUrl: true,
                isVerified: true
            }
        });

        res.json({
            message: 'Verification request submitted successfully',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: Get all verification requests
exports.getVerificationRequests = async (req, res) => {
    try {
        const { status } = req.query;

        const where = {};
        if (status) {
            where.verificationStatus = status;
        } else {
            // Default: only show PENDING requests
            where.verificationStatus = 'PENDING';
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                avatar: true,
                ktpImageUrl: true,
                verificationStatus: true,
                verificationNote: true,
                isVerified: true,
                verifiedAt: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: Update verification status
exports.updateVerificationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, note } = req.body;

        if (!['VERIFIED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Must be VERIFIED or REJECTED' });
        }

        const updateData = {
            verificationStatus: status,
            verificationNote: note || null
        };

        if (status === 'VERIFIED') {
            updateData.isVerified = true;
            updateData.verifiedAt = new Date();
        } else if (status === 'REJECTED') {
            updateData.isVerified = false;
            updateData.verifiedAt = null;
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                verificationStatus: true,
                isVerified: true,
                verificationNote: true,
                verifiedAt: true
            }
        });

        res.json({
            message: `User ${status === 'VERIFIED' ? 'verified' : 'rejected'} successfully`,
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};