const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // =========================
    // ADMIN
    // =========================
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
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

    // =========================
    // SHELTERS (5)
    // =========================
    await Promise.all([
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
                imageUrl: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d'
            }
        }),
        prisma.shelter.upsert({
            where: { id: 'shelter-5' },
            update: {},
            create: {
                id: 'shelter-5',
                name: 'Whisker Haven',
                description: 'Shelter ramah untuk kucing rescue dan adopsi',
                address: 'Jl. Antasari No. 55, Jakarta Selatan',
                phone: '021-55443322',
                email: 'hello@whiskerhaven.com',
                capacity: 45,
                currentOccupancy: 20,
                isAvailable: true,
                imageUrl: 'https://images.unsplash.com/photo-1601758123927-1961d6a17f5c'
            }
        })
    ]);
    console.log('✅ Shelters created');

    // =========================
    // PETS (30)
    // =========================
    const cats = [
        'Milo', 'Luna', 'Oliver', 'Leo', 'Bella', 'Kitty',
        'Simba', 'Chloe', 'Nala', 'Coco', 'Rocky', 'Lily',
        'Mochi', 'Oreo', 'Pumpkin', 'Shadow', 'Snowy',
        'Peanut', 'Misty', 'Poppy', 'Lucky', 'Max',
        'Ruby', 'Charlie', 'Daisy', 'Toby', 'Rosie',
        'Finn', 'Zoe', 'Tiger'
    ];

    const shelterIds = [
        'shelter-1',
        'shelter-2',
        'shelter-3',
        'shelter-4',
        'shelter-5'
    ];

    await Promise.all(
        cats.map((name, index) =>
            prisma.pet.create({
                data: {
                    name,
                    description: 'Siap untuk diadopsi',
                    about: `${name} adalah kucing yang sehat, aktif, dan ramah terhadap manusia.`,
                    imageUrl: `https://source.unsplash.com/400x400/?cat,kitten&sig=${index}`,
                    age: `${(index % 5) + 1} tahun`,
                    gender: index % 2 === 0 ? 'Jantan' : 'Betina',
                    breed: 'Domestic Mix',
                    vaccine: index % 3 === 0 ? 'Lengkap' : 'Tahap 1',
                    steril: index % 2 === 0 ? 'Sudah' : 'Belum',
                    shelterId: shelterIds[index % shelterIds.length],
                    status: 'AVAILABLE'
                }
            })
        )
    );
    console.log('✅ 30 Cats created');

    // =========================
    // CAMPAIGNS (10)
    // =========================
    await Promise.all([
        prisma.campaign.create({
            data: {
                title: 'Pakan kucing di shelter',
                description: 'Bantu kami menyediakan makanan berkualitas untuk 50+ kucing',
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
                description: 'Membangun kandang yang lebih nyaman dan aman',
                imageUrl: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca',
                targetAmount: 10000000,
                currentAmount: 7500000,
                shelterId: 'shelter-2',
                status: 'ACTIVE'
            }
        }),
        prisma.campaign.create({
            data: {
                title: 'Biaya kesehatan & vaksin',
                description: 'Dana untuk vaksinasi dan pemeriksaan kesehatan rutin',
                imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
                targetAmount: 3000000,
                currentAmount: 500000,
                shelterId: 'shelter-3',
                status: 'ACTIVE'
            }
        }),
        prisma.campaign.create({
            data: {
                title: 'Perbaikan pagar shelter',
                description: 'Memperbaiki pagar dan area luar agar aman untuk kucing',
                imageUrl: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8',
                targetAmount: 2000000,
                currentAmount: 800000,
                shelterId: 'shelter-4',
                status: 'ACTIVE'
            }
        }),
        prisma.campaign.create({
            data: {
                title: 'Perlengkapan Kandang Baru',
                description: 'Membeli kasur, mainan, dan litter tray untuk kucing',
                imageUrl: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39',
                targetAmount: 4000000,
                currentAmount: 1200000,
                shelterId: 'shelter-5',
                status: 'ACTIVE'
            }
        }),
        prisma.campaign.create({
            data: {
                title: 'Transportasi Adopsi',
                description: 'Dana untuk transportasi kucing ke rumah adoptor',
                imageUrl: 'https://images.unsplash.com/photo-1516280030429-3f7b4f9a3e6a',
                targetAmount: 1500000,
                currentAmount: 300000,
                shelterId: 'shelter-1',
                status: 'ACTIVE'
            }
        }),
        prisma.campaign.create({
            data: {
                title: 'Pendidikan & Pelatihan Volunteer',
                description: 'Pelatihan untuk volunteer dan staf shelter',
                imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
                targetAmount: 2500000,
                currentAmount: 600000,
                shelterId: 'shelter-2',
                status: 'ACTIVE'
            }
        }),
        prisma.campaign.create({
            data: {
                title: 'Sterilisasi Massal',
                description: 'Program sterilisasi untuk mencegah overpopulation',
                imageUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086',
                targetAmount: 8000000,
                currentAmount: 1500000,
                shelterId: 'shelter-3',
                status: 'ACTIVE'
            }
        }),
        prisma.campaign.create({
            data: {
                title: 'Klinik Kucing Keliling',
                description: 'Menyediakan layanan klinik keliling untuk kucing jalanan',
                imageUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d',
                targetAmount: 6000000,
                currentAmount: 2000000,
                shelterId: 'shelter-4',
                status: 'ACTIVE'
            }
        }),
        prisma.campaign.create({
            data: {
                title: 'Emergency Fund',
                description: 'Dana darurat untuk operasi dan kasus critical',
                imageUrl: 'https://images.unsplash.com/photo-1511910849309-6c0d6d8b1d1f',
                targetAmount: 12000000,
                currentAmount: 4500000,
                shelterId: 'shelter-5',
                status: 'ACTIVE'
            }
        })
    ]);
    console.log('✅ 10 Campaigns created');

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
