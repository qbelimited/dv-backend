import { DVSerialService } from './dv-plates.service';
import { Response } from 'express';
export declare class DVSerialController {
    private readonly dvSerialService;
    constructor(dvSerialService: DVSerialService);
    parseFile(files: Express.Multer.File[], res: Response): Promise<Response<any, Record<string, any>>>;
    search(dvPlateNumber: string, serialNumber: string, batch: string, createdAt: string, res: Response): Promise<Response<any, Record<string, any>>>;
    batchSearch(batch: string, res: Response): Promise<Response<any, Record<string, any>>>;
    filter(creationDate: string, insertedAt: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getBatches(res: Response): Promise<Response<any, Record<string, any>>>;
    getBatchById(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    updateBatch(body: {
        id: string;
        batch_number: string;
        description: string;
        requested_by: string;
        status: string;
        total_dvplates: number;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    createBatch(body: {
        batch_number: string;
        requested_by: string;
        status: string;
        total_dvplates: number;
        manufacturer_id: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    getManufacturers(res: Response): Promise<Response<any, Record<string, any>>>;
    getManufacturerById(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    createManufacturer(body: {
        manufacturer_name: string;
        address?: string;
        contact_person_name: string;
        email: string;
        phone_number?: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    searchManufacturer(name: string, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteManufacturer(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    updatePlate(body: {
        id: string;
        description: string;
        log_book_number: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
}
