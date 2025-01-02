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
        contact_person_name: string;
        email: string;
        phone_number: string | null;
        manufacturerId: string | null;
    }>;
    getManufacturers(): Promise<({
        contactPersons: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            contact_person_name: string;
            email: string;
            phone_number: string | null;
            manufacturerId: string | null;
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
        manufacturerId: string | null;
        batch_number: string;
        requested_by: string | null;
        status: string | null;
        description: string | null;
        total_dvplates: number;
    }>;
    getBatches(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        manufacturerId: string | null;
        batch_number: string;
        requested_by: string | null;
        status: string | null;
        description: string | null;
        total_dvplates: number;
    }[]>;
    getBatchById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        manufacturerId: string | null;
        batch_number: string;
        requested_by: string | null;
        status: string | null;
        description: string | null;
        total_dvplates: number;
    }>;
    updatePlate(id: string, description: string, log_book_number: string): Promise<{
        id: string;
        updatedAt: Date;
        description: string | null;
        dv_plate_number: string;
        serial_number: string;
        creation_date: string | null;
        log_book_number: string | null;
        insertedAt: Date;
        batchId: string;
    }>;
    updateBatch(id: string, batch_number: string, description: string, requested_by: string, status: string, total_dvplates: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        manufacturerId: string | null;
        batch_number: string;
        requested_by: string | null;
        status: string | null;
        description: string | null;
        total_dvplates: number;
    }>;
    deleteBatch(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        manufacturerId: string | null;
        batch_number: string;
        requested_by: string | null;
        status: string | null;
        description: string | null;
        total_dvplates: number;
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
