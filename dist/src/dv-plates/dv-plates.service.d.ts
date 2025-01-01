import { PrismaService } from 'src/prisma/prisma.service';
interface DVSerialEntry {
    dv_plate_number: string;
    serial_number: string;
    creation_date: string;
    batchId: string;
}
export declare class DVSerialService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    parseSerialNumberFile(fileContent: string): Promise<DVSerialEntry[]>;
    search(dvPlateNumber?: string, serialNumber?: string, batch?: string, creationDate?: string, insertedAt?: string): Promise<any>;
    batch_search(batch: string): Promise<any>;
    filter(filters: {
        creationDate?: string;
        insertedAt?: string;
    }): Promise<any[]>;
    saveEntriesToDatabase(entries: any[]): Promise<void>;
    getAllData(): Promise<void>;
    readFileContent(file: Express.Multer.File): Promise<string>;
    createManufacturer(name: string, address?: string): Promise<{
        id: string;
        manufacturer_name: string;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createContactPerson(name: string, email: string, phone_number: string, manufacturer_id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        manufacturerId: string | null;
        contact_person_name: string;
        phone_number: string | null;
    }>;
    getManufacturers(): Promise<({
        contactPersons: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            manufacturerId: string | null;
            contact_person_name: string;
            phone_number: string | null;
        }[];
    } & {
        id: string;
        manufacturer_name: string;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getManufacturerById(id: string): Promise<{
        id: string;
        manufacturer_name: string;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createBatch(batch_number: string, requested_by: string, status: string, total_dvplates: number, manufacturer_id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        batch_number: string;
        requested_by: string | null;
        status: string | null;
        total_dvplates: number;
        manufacturerId: string | null;
    }>;
    getBatches(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        batch_number: string;
        requested_by: string | null;
        status: string | null;
        total_dvplates: number;
        manufacturerId: string | null;
    }[]>;
    getBatchById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        batch_number: string;
        requested_by: string | null;
        status: string | null;
        total_dvplates: number;
        manufacturerId: string | null;
    }>;
    updatePlate(id: string, description: string): Promise<{
        id: string;
        updatedAt: Date;
        description: string | null;
        dv_plate_number: string;
        serial_number: string;
        creation_date: string | null;
        insertedAt: Date;
        batchId: string;
    }>;
    updateBatch(id: string, batch_number: string, requested_by: string, status: string, total_dvplates: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        batch_number: string;
        requested_by: string | null;
        status: string | null;
        total_dvplates: number;
        manufacturerId: string | null;
    }>;
    deleteBatch(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        batch_number: string;
        requested_by: string | null;
        status: string | null;
        total_dvplates: number;
        manufacturerId: string | null;
    }>;
    deleteManufacturer(id: string): Promise<{
        id: string;
        manufacturer_name: string;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateManufacturer(id: string, name: string, address: string): Promise<{
        id: string;
        manufacturer_name: string;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    searchManufacturer(name: string): Promise<{
        id: string;
        manufacturer_name: string;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
export {};
