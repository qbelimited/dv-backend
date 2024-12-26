import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const bcpass = bcryptjs.hashSync('123456', 10);

    // Clean up existing data
    await prisma.contactPerson.deleteMany();
    await prisma.manufacturers.deleteMany();
    await prisma.user.deleteMany();

    // Seed users
    const newUsers = await prisma.user.createMany({
        data: [
            {
                name: 'Admin Name',
                email: 'p1@correo.com',
                password: bcpass,
                role: 'admin',
            },
            {
                name: 'User Name',
                email: 'p2@correo.com',
                password: bcpass,
            },
        ],
    });

    // Seed manufacturers with associated contact persons
    const manufacturers = await prisma.manufacturers.createMany({
        data: [
            { manufacturer_name: 'Manufacturer A', address: '123 Main St, City, Country' },
            { manufacturer_name: 'Manufacturer B', address: '456 Market St, City, Country' },
            { manufacturer_name: 'Manufacturer C', address: '789 Park Ave, City, Country' },
            { manufacturer_name: 'Manufacturer D', address: '101 First St, City, Country' },
        ],
    });

    // Retrieve manufacturer IDs
    const manufacturerA = await prisma.manufacturers.findUnique({
        where: { manufacturer_name: 'Manufacturer A' },
    });

    const manufacturerB = await prisma.manufacturers.findUnique({
        where: { manufacturer_name: 'Manufacturer B' },
    });

    // Seed contact persons for Manufacturer A
    await prisma.contactPerson.createMany({
        data: [
            {
                contact_person_name: 'John Doe',
                email: 'john.doe@example.com',
                phone_number: '123-456-7890',
                manufacturerId: manufacturerA?.id,
            },
            {
                contact_person_name: 'Jane Smith',
                email: 'jane.smith@example.com',
                phone_number: '987-654-3210',
                manufacturerId: manufacturerA?.id,
            },
        ],
    });

    // Seed contact persons for Manufacturer B
    await prisma.contactPerson.createMany({
        data: [
            {
                contact_person_name: 'Alice Brown',
                email: 'alice.brown@example.com',
                phone_number: '234-567-8901',
                manufacturerId: manufacturerB?.id,
            },
            {
                contact_person_name: 'Bob White',
                email: 'bob.white@example.com',
                phone_number: '876-543-2109',
                manufacturerId: manufacturerB?.id,
            },
        ],
    });

    console.log({
        message: 'Database seeded successfully!',
        newUsers,
        manufacturers,
    });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma Client at the end
    await prisma.$disconnect();
  });
