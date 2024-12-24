import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    
    const bcpass = bcryptjs.hashSync('123456', 10);

    // Clean up existing data
    await prisma.user.deleteMany();
    await prisma.manufacturers.deleteMany();

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

    // Seed manufacturers
    const newManufacturers = await prisma.manufacturers.createMany({
        data: [
            { manufacturer_name: 'Manufacturer A', address: '123 Main St, City, Country' },
            { manufacturer_name: 'Manufacturer B', address: '456 Market St, City, Country' },
            { manufacturer_name: 'Manufacturer C', address: '789 Park Ave, City, Country' },
            { manufacturer_name: 'Manufacturer D', address: '101 First St, City, Country' },
            { manufacturer_name: 'Manufacturer E', address: '202 Second St, City, Country' },
            { manufacturer_name: 'Manufacturer F', address: '303 Third St, City, Country' },
            { manufacturer_name: 'Manufacturer G', address: '404 Fourth St, City, Country' },
            { manufacturer_name: 'Manufacturer H', address: '505 Fifth St, City, Country' },
            { manufacturer_name: 'Manufacturer I', address: '606 Sixth St, City, Country' },
            { manufacturer_name: 'Manufacturer J', address: '707 Seventh St, City, Country' },
        ],
    });

    console.log({ newUsers, newManufacturers });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
