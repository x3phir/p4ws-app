const prisma = require('../config/database');
const notificationController = require('./notificationController');

// Get all reports
exports.getAllReports = async (req, res) => {
    try {
        const { status, userId } = req.query;

        const where = {};
        if (status) where.status = status;
        if (userId) where.userId = userId;

        const reports = await prisma.report.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                shelter: {
                    select: {
                        id: true,
                        name: true,
                        address: true
                    }
                },
                timeline: {
                    orderBy: { createdAt: 'desc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get report by ID
exports.getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await prisma.report.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                },
                shelter: true,
                timeline: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        res.json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create report
exports.createReport = async (req, res) => {
    try {
        const { location, condition, description, shelterId } = req.body;
        const userId = req.user.id;

        let imageUrl = req.body.imageUrl;
        if (req.file) {
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const report = await prisma.$transaction(async (tx) => {
            const newReport = await tx.report.create({
                data: {
                    userId,
                    location,
                    condition: condition ? condition.toUpperCase() : 'SEHAT',
                    imageUrl,
                    description,
                    shelterId,
                    timeline: {
                        create: {
                            activity: 'Laporan Dibuat',
                            description: 'Laporan kucing terlantar telah diterima sistem',
                            icon: 'check-circle'
                        }
                    }
                },
                include: {
                    shelter: true,
                    timeline: true
                }
            });

            // Update shelter occupancy
            await tx.shelter.update({
                where: { id: shelterId },
                data: { currentOccupancy: { increment: 1 } }
            });

            // Create notification for user
            await notificationController.createNotification(
                userId,
                'Laporan Terkirim',
                `Laporan kucing terlantar di ${location} telah berhasil dibuat.`,
                'REPORT_CREATED'
            );

            return newReport;
        });

        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update report status
exports.updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, activity, description, adminNote } = req.body;

        const currentReport = await prisma.report.findUnique({ where: { id } });
        if (!currentReport) return res.status(404).json({ error: 'Report not found' });

        const report = await prisma.$transaction(async (tx) => {
            const updatedReport = await tx.report.update({
                where: { id },
                data: {
                    status,
                    adminNote: adminNote !== undefined ? adminNote : currentReport.adminNote,
                    timeline: {
                        create: {
                            activity: activity || (status === 'REJECTED' ? 'Laporan Ditolak' : `Status diubah menjadi ${status}`),
                            description: description || (status === 'REJECTED' ? (adminNote || 'Maaf, laporan Anda tidak dapat diproses.') : `Laporan telah diupdate ke status ${status}`),
                            icon: status === 'REJECTED' ? 'x-circle' : 'info'
                        }
                    }
                },
                include: {
                    shelter: true,
                    timeline: {
                        orderBy: { createdAt: 'desc' }
                    }
                }
            });

            // If moving to REJECTED or CANCELLED from a non-terminating state, decrement occupancy
            const terminatingStatuses = ['REJECTED', 'CANCELLED'];
            if (terminatingStatuses.includes(status) && !terminatingStatuses.includes(currentReport.status)) {
                await tx.shelter.update({
                    where: { id: updatedReport.shelterId },
                    data: { currentOccupancy: { decrement: 1 } }
                });
            }

            return updatedReport;
        });

        // Create notification for user
        await notificationController.createNotification(
            report.userId,
            status === 'REJECTED' ? 'Laporan Ditolak' : 'Update Status Laporan',
            status === 'REJECTED'
                ? `Laporan Anda telah ditolak. Alasan: ${adminNote || 'Tidak disebutkan'}`
                : (activity || `Laporan Anda telah diperbarui menjadi: ${status}`),
            'REPORT_UPDATE'
        );

        res.json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add timeline entry
exports.addTimelineEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { activity, description, icon } = req.body;

        const timeline = await prisma.timeline.create({
            data: {
                reportId: id,
                activity,
                description,
                icon
            }
        });

        // Get report to find userId
        const report = await prisma.report.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (report) {
            await notificationController.createNotification(
                report.userId,
                'Update Timeline Laporan',
                activity,
                'REPORT_UPDATE'
            );
        }

        res.status(201).json(timeline);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
