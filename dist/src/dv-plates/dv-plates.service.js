"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DVSerialService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DVSerialService = class DVSerialService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async parseSerialNumberFile(fileContent) {
        const plateNumberMatch = fileContent.match(/DV (\d+)Y - (\d+)Y/);
        const startPlateNumber = plateNumberMatch ? parseInt(plateNumberMatch[1]) : 1;
        const endPlateNumber = plateNumberMatch ? parseInt(plateNumberMatch[2]) : 100;
        const batchName = `DV ${startPlateNumber} - ${endPlateNumber} Y`;
        const lines = fileContent.split('\n').map(line => line.trim()).filter(line => line);
        const entries = [];
        const uniqueSerialNumbers = new Set();
        let currentPlateNumber = startPlateNumber;
        let totalDvPlates = endPlateNumber - startPlateNumber + 1;
        let batch = await this.prisma.dvbatches.findUnique({ where: { batch_number: batchName } });
        if (!batch) {
            batch = await this.prisma.dvbatches.create({
                data: {
                    batch_number: batchName,
                    requested_by: '',
                    status: 'Processing',
                    total_dvplates: totalDvPlates,
                },
            });
        }
        batch = await this.prisma.dvbatches.findUnique({ where: { batch_number: batchName } });
        for (let i = 0; i < lines.length; i++) {
            const dateMatch = lines[i].match(/(?:&\[|\()(\d{4}\/\d{2}\/\d{2} \d{1,2}:\d{1,2}(:\d{1,2})?)(?:\]|\))?/);
            if (dateMatch && i + 1 < lines.length) {
                const creationDate = dateMatch[1];
                const serialNumber = lines[i + 1];
                if (!/^[\w-]+$/.test(serialNumber))
                    continue;
                if (uniqueSerialNumbers.has(serialNumber)) {
                    console.warn(`Duplicate serial number skipped: ${serialNumber}`);
                    continue;
                }
                entries.push({
                    dv_plate_number: `DV ${currentPlateNumber} Y`,
                    serial_number: serialNumber,
                    creation_date: creationDate,
                    batchId: batch.id,
                });
                uniqueSerialNumbers.add(serialNumber);
                currentPlateNumber++;
                if (currentPlateNumber > endPlateNumber) {
                    currentPlateNumber = startPlateNumber;
                }
                i++;
            }
        }
        await this.prisma.dvbatches.update({
            where: { batch_number: batchName },
            data: { total_dvplates: entries.length }
        });
        return entries;
    }
    async search(dvPlateNumber, serialNumber, batch, creationDate, insertedAt) {
        const filters = {};
        if (dvPlateNumber)
            filters.dv_plate_number = dvPlateNumber;
        if (serialNumber)
            filters.serial_number = serialNumber;
        if (creationDate)
            filters.creation_date = creationDate;
        if (insertedAt)
            filters.insertedAt = new Date(insertedAt);
        console.log(batch);
        const batches = await this.prisma.dvbatches.findMany({
            select: {
                id: true,
                batch_number: true,
                total_dvplates: true,
            },
        });
        const filteredBatchId = batches.filter(batchItem => batchItem.batch_number === batch)[0]?.id || '';
        const dvplatesWhereClause = {
            dv_plate_number: dvPlateNumber,
            serial_number: serialNumber,
            creation_date: creationDate,
            insertedAt: insertedAt,
        };
        if (filteredBatchId && filteredBatchId !== '') {
            dvplatesWhereClause.batchId = filteredBatchId;
        }
        const dvplates = await this.prisma.dvplates.findMany({
            where: dvplatesWhereClause,
            select: {
                dv_plate_number: true,
                serial_number: true,
                creation_date: true,
                insertedAt: true,
                description: true,
            },
        });
        const batchCountResults = batches.map(batch => {
            return {
                batch: batch.batch_number,
                count: batch.total_dvplates
            };
        });
        return {
            batches: batchCountResults,
            dvplatesdata: dvplates,
        };
    }
    async batch_search(batch) {
        const batchData = await this.prisma.dvbatches.findUnique({
            where: {
                batch_number: batch,
            },
            select: {
                id: true,
                batch_number: true,
                dvplates: {
                    select: {
                        dv_plate_number: true,
                        serial_number: true,
                        creation_date: true,
                        insertedAt: true,
                    },
                },
            },
        });
        if (!batchData) {
            return { message: "Batch not found", batch_number: batch };
        }
        return {
            batch: batchData.batch_number,
            dvplates: batchData.dvplates,
        };
    }
    async filter(filters) {
        return this.prisma.dvplates.findMany({
            where: {
                creation_date: filters.creationDate,
                insertedAt: filters.insertedAt ? new Date(filters.insertedAt) : undefined,
            },
        });
    }
    async saveEntriesToDatabase(entries) {
        await this.prisma.dvplates.createMany({
            data: entries,
        });
    }
    async getAllData() {
        await this.prisma.dvplates.findMany({});
    }
    async readFileContent(file) {
        return file.buffer.toString('utf-8');
    }
    async createManufacturer(name, address) {
        return this.prisma.manufacturers.create({
            data: {
                manufacturer_name: name,
                address: address || '',
            },
        });
    }
    async createContactPerson(name, email, phone_number, manufacturer_id) {
        return this.prisma.contactPerson.create({
            data: {
                contact_person_name: name,
                email,
                phone_number,
                manufacturerId: manufacturer_id,
            },
        });
    }
    async getManufacturers() {
        return this.prisma.manufacturers.findMany({
            include: {
                contactPersons: true,
            },
        });
    }
    async getManufacturerById(id) {
        return this.prisma.manufacturers.findUnique({ where: { id }, });
    }
    async createBatch(batch_number, requested_by, status, total_dvplates, manufacturer_id) {
        return this.prisma.dvbatches.create({
            data: {
                batch_number,
                requested_by,
                status,
                total_dvplates,
                manufacturerId: manufacturer_id
            },
        });
    }
    async getBatches() {
        return this.prisma.dvbatches.findMany();
    }
    async getBatchById(id) {
        return this.prisma.dvbatches.findUnique({ where: { id }, });
    }
    async updatePlate(id, description) {
        return this.prisma.dvplates.update({
            where: { id },
            data: {
                description
            },
        });
    }
    async updateBatch(id, batch_number, requested_by, status, total_dvplates) {
        return this.prisma.dvbatches.update({
            where: { id },
            data: {
                batch_number,
                requested_by,
                status,
                total_dvplates,
            },
        });
    }
    async deleteBatch(id) {
        return this.prisma.dvbatches.delete({ where: { id }, });
    }
    async deleteManufacturer(id) {
        return this.prisma.manufacturers.delete({ where: { id } });
    }
    async updateManufacturer(id, name, address) {
        return this.prisma.manufacturers.update({
            where: { id },
            data: {
                manufacturer_name: name,
                address: address,
            },
        });
    }
    async searchManufacturer(name) {
        return this.prisma.manufacturers.findMany({
            where: {
                manufacturer_name: {
                    contains: name,
                },
            },
        });
    }
};
exports.DVSerialService = DVSerialService;
exports.DVSerialService = DVSerialService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DVSerialService);
//# sourceMappingURL=dv-plates.service.js.map