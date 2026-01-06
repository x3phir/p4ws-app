const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@catrescue.com' },
        update: {},
        create: {
            email: 'admin@catrescue.com',
            password: hashedPassword,
            name: 'Admin User',
            phone: '081234567890',
            role: 'ADMIN'
        }
    });
    console.log('✅ Admin user created');

    // Create shelters
    const shelters = await Promise.all([
        prisma.shelter.upsert({
            where: { id: 'shelter-1' },
            update: {},
            create: {
                id: 'shelter-1',
                name: 'Paw Care',
                description: 'Shelter kucing terpercaya dengan fasilitas lengkap',
                address: 'Jl. Raya Bogor No. 123, Jakarta Timur',
                phone: '021-12345678',
                email: 'contact@pawcare.com',
                capacity: 50,
                currentOccupancy: 32,
                isAvailable: true,
                imageUrl: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987'
            }
        }),
        prisma.shelter.upsert({
            where: { id: 'shelter-2' },
            update: {},
            create: {
                id: 'shelter-2',
                name: 'Kitten Home',
                description: 'Rumah nyaman untuk kucing-kucing terlantar',
                address: 'Jl. Sudirman No. 45, Jakarta Pusat',
                phone: '021-87654321',
                email: 'info@kittenhome.com',
                capacity: 30,
                currentOccupancy: 18,
                isAvailable: true,
                imageUrl: 'https://images.unsplash.com/photo-1573865668131-974279df4045'
            }
        }),
        prisma.shelter.upsert({
            where: { id: 'shelter-3' },
            update: {},
            create: {
                id: 'shelter-3',
                name: 'Pet House',
                description: 'Shelter dengan kapasitas besar',
                address: 'Jl. Gatot Subroto No. 78, Jakarta Selatan',
                phone: '021-11223344',
                email: 'hello@pethouse.com',
                capacity: 40,
                currentOccupancy: 40,
                isAvailable: false,
                imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba'
            }
        }),
        prisma.shelter.upsert({
            where: { id: 'shelter-4' },
            update: {},
            create: {
                id: 'shelter-4',
                name: 'Cat Sanctuary',
                description: 'Sanctuary luas untuk kucing-kucing',
                address: 'Jl. Thamrin No. 90, Jakarta Pusat',
                phone: '021-99887766',
                email: 'care@catsanctuary.com',
                capacity: 60,
                currentOccupancy: 25,
                isAvailable: true,
                imageUrl: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400'
            }
        })
    ]);
    console.log('✅ Shelters created');

    // Create pets
    await Promise.all([
        prisma.pet.create({
            data: {
                name: 'Molly',
                description: 'Si Kecil Aktif',
                about: 'Molly adalah kucing betina yang penuh kasih sayang dan anggun. Ia sangat suka bermain bola bulu di pagi hari.',
                imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
                age: '2 tahun',
                gender: 'Betina',
                breed: 'Domestic Short Hair',
                vaccine: 'Lengkap',
                steril: 'Sudah',
                shelterId: 'shelter-1',
                status: 'AVAILABLE'
            }
        }),
        prisma.pet.create({
            data: {
                name: 'Luna',
                description: 'Pendiam & Manis',
                about: 'Luna kucing yang tenang. Cocok untuk pemilik yang suka suasana rumah yang damai.',
                imageUrl: 'https://images.unsplash.com/photo-1513245533132-aa7f8176b202',
                age: '1 tahun',
                gender: 'Betina',
                breed: 'Persian Mix',
                vaccine: 'Tahap 1',
                steril: 'Belum',
                shelterId: 'shelter-2',
                status: 'AVAILABLE'
            }
        })
    ]);
    console.log('✅ Pets created');

    // Create campaigns
    await Promise.all([
        prisma.campaign.create({
            data: {
                title: 'Pakan kucing di shelter',
                description: 'Bantu kami menyediakan makanan berkualitas untuk 50+ kucing di shelter',
                imageUrl: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42',
                targetAmount: 5000000,
                currentAmount: 2500000,
                shelterId: 'shelter-1',
                status: 'ACTIVE'
            }
        }),
        prisma.campaign.create({
            data: {
                title: 'Renovasi kandang kucing',
                description: 'Membangun kandang yang lebih nyaman dan aman untuk kucing-kucing kami',
                imageUrl: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca',
                targetAmount: 10000000,
                currentAmount: 7500000,
                shelterId: 'shelter-2',
                status: 'ACTIVE'
            }
        })
    ]);
    console.log('✅ Campaigns created');

    console.log('🎉 Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
