const prisma = require('../config/database');

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
        const { location, condition, imageUrl, description, shelterId } = req.body;
        const userId = req.user.id;

        const report = await prisma.report.create({
            data: {
                userId,
                location,
                condition,
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

        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update report status
exports.updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, activity, description } = req.body;

        const report = await prisma.report.update({
            where: { id },
            data: {
                status,
                timeline: {
                    create: {
                        activity: activity || `Status diubah menjadi ${status}`,
                        description: description || `Laporan telah diupdate ke status ${status}`,
                        icon: 'info'
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

        res.status(201).json(timeline);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
