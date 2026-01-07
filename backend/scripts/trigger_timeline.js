const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function triggerTimeline() {
    // Get the latest report
    const latestReport = await prisma.report.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    });

    if (!latestReport) {
        console.log('No reports found to update.');
        return;
    }

    console.log(`Updating timeline for Report ID: ${latestReport.id} (User: ${latestReport.user.name})`);

    const activity = 'Tim Rescue sedang meluncur ke lokasi!';
    const description = 'Petugas dari Shelter sudah berangkat menggunakan kendaraan evakuasi.';

    const timeline = await prisma.timeline.create({
        data: {
            reportId: latestReport.id,
            activity,
            description,
            icon: 'truck'
        }
    });

    // Create notification manually since we are not going through the controller
    await prisma.notification.create({
        data: {
            userId: latestReport.userId,
            title: 'Update Timeline Laporan',
            message: activity,
            type: 'REPORT_UPDATE'
        }
    });

    console.log('Successfully added timeline entry and created notification.');
    process.exit(0);
}

triggerTimeline().catch(err => {
    console.error(err);
    process.exit(1);
});
