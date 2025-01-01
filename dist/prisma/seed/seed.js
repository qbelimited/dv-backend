"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const bcpass = bcryptjs_1.default.hashSync('123456', 10);
    await prisma.contactPerson.deleteMany();
    await prisma.manufacturers.deleteMany();
    await prisma.user.deleteMany();
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
    const manufacturers = await prisma.manufacturers.createMany({
        data: [
            { manufacturer_name: 'Manufacturer A', address: '123 Main St, City, Country' },
            { manufacturer_name: 'Manufacturer B', address: '456 Market St, City, Country' },
            { manufacturer_name: 'Manufacturer C', address: '789 Park Ave, City, Country' },
            { manufacturer_name: 'Manufacturer D', address: '101 First St, City, Country' },
        ],
    });
    const manufacturerA = await prisma.manufacturers.findUnique({
        where: { manufacturer_name: 'Manufacturer A' },
    });
    const manufacturerB = await prisma.manufacturers.findUnique({
        where: { manufacturer_name: 'Manufacturer B' },
    });
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
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map