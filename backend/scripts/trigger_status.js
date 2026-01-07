const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function triggerStatus() {
    // Get the latest report
    const latestReport = await prisma.report.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    });

    if (!latestReport) {
        console.log('No reports found to update.');
        return;
    }

    const newStatus = 'PROCESSING';
    const activity = 'Laporan sedang diproses!';
    const description = 'Tim rescue kami sudah berada di lokasi untuk memberikan pertolongan.';

    console.log(`Updating Status for Report ID: ${latestReport.id} (User: ${latestReport.user.name})`);
    console.log(`New Status: ${newStatus}`);

    const updatedReport = await prisma.report.update({
        where: { id: latestReport.id },
        data: {
            status: newStatus,
            timeline: {
                create: {
                    activity,
                    description,
                    icon: 'clock'
                }
            }
        }
    });

    // Create notification manually
    await prisma.notification.create({
        data: {
            userId: latestReport.userId,
            title: 'Update Status Laporan',
            message: activity,
            type: 'REPORT_UPDATE'
        }
    });

    console.log('Successfully updated status, added timeline, and created notification.');
    process.exit(0);
}

triggerStatus().catch(err => {
    console.error(err);
    process.exit(1);
});
