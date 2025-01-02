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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DVSerialController = void 0;
const common_1 = require("@nestjs/common");
const dv_plates_service_1 = require("./dv-plates.service");
const platform_express_1 = require("@nestjs/platform-express");
let DVSerialController = class DVSerialController {
    constructor(dvSerialService) {
        this.dvSerialService = dvSerialService;
    }
    async parseFile(files, res) {
        try {
            if (!files || files.length === 0) {
                return res.status(400).json({
                    message: 'No files uploaded',
                });
            }
            const allEntries = [];
            for (const file of files) {
                const fileContent = await this.dvSerialService.readFileContent(file);
                const entries = await this.dvSerialService.parseSerialNumberFile(fileContent);
                allEntries.push(...entries);
            }
            await this.dvSerialService.saveEntriesToDatabase(allEntries);
            return res.json({
                message: 'Files parsed successfully',
                totalEntries: allEntries.length,
                data: allEntries,
            });
        }
        catch (error) {
            return res.status(500).json({
                message: 'Error processing files',
                error: error.message,
            });
        }
    }
    async search(dvPlateNumber, serialNumber, batch, createdAt, res) {
        try {
            const result = await this.dvSerialService.search(dvPlateNumber, serialNumber, batch, createdAt);
            return res.json(result);
        }
        catch (error) {
            return res.status(500).json({ message: 'Error during search', error: error.message });
        }
    }
    async batchSearch(batch, res) {
        try {
            const result = await this.dvSerialService.batch_search(batch);
            return res.json(result);
        }
        catch (error) {
            return res.status(500).json({ message: 'Error during batch search', error: error.message });
        }
    }
    async filter(creationDate, insertedAt, res) {
        try {
            const results = await this.dvSerialService.filter({ creationDate, insertedAt });
            return res.json(results);
        }
        catch (error) {
            return res.status(500).json({ message: 'Error during filtering', error: error.message });
        }
    }
    async getBatches(res) {
        try {
            const batches = await this.dvSerialService.getBatches();
            return res.json(batches);
        }
        catch (error) {
            return res.status(500).json({ message: 'Error getting batches', error: error.message });
        }
    }
    async getBatchById(id, res) {
        try {
            const batch = await this.dvSerialService.getBatchById(id);
            return res.json(batch);
        }
        catch (error) {
            return res.status(500).json({ message: 'Error getting batch by id', error: error.message });
        }
    }
    async updateBatch(body, res) {
        try {
            const { id, batch_number, requested_by, description, status, total_dvplates } = body;
            await this.dvSerialService.updateBatch(id, batch_number, description, requested_by, status, total_dvplates);
            return res.json({ message: 'Batch updated successfully' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Error updating batch', error: error.message });
        }
    }
    async createBatch(body, res) {
        try {
            const { batch_number, requested_by, status, total_dvplates, manufacturer_id } = body;
            await this.dvSerialService.createBatch(batch_number, requested_by, status, total_dvplates, manufacturer_id);
            return res.json({ message: 'Batch created successfully' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Error creating batch', error: error.message });
        }
    }
    async getManufacturers(res) {
        try {
            const manufacturers = await this.dvSerialService.getManufacturers();
            return res.json(manufacturers);
        }
        catch (error) {
            return res.status(500).json({ message: 'Error getting manufacturers', error: error.message });
        }
    }
    async getManufacturerById(id, res) {
        try {
            const manufacturer = await this.dvSerialService.getManufacturerById(id);
            return res.json(manufacturer);
        }
        catch (error) {
            return res.status(500).json({ message: 'Error getting manufacturer by id', error: error.message });
        }
    }
    async createManufacturer(body, res) {
        try {
            const { manufacturer_name, address, contact_person_name, email, phone_number } = body;
            const manufacturer = await this.dvSerialService.createManufacturer(manufacturer_name, address);
            await this.dvSerialService.createContactPerson(contact_person_name, email, phone_number, manufacturer.id);
            return res.json({ message: 'Manufacturer created successfully' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Error creating manufacturer', error: error.message });
        }
    }
    async searchManufacturer(name, res) {
        try {
            const result = await this.dvSerialService.searchManufacturer(name);
            return res.json(result);
        }
        catch (error) {
            return res.status(500).json({ message: 'Error searching manufacturer', error: error.message });
        }
    }
    async deleteManufacturer(id, res) {
        try {
            await this.dvSerialService.deleteManufacturer(id);
            return res.json({ message: 'Manufacturer deleted successfully' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Error deleting manufacturer', error: error.message });
        }
    }
    async updatePlate(body, res) {
        try {
            const { id, description, log_book_number } = body;
            await this.dvSerialService.updatePlate(id, description, log_book_number);
            return res.json({ message: 'Plate updated successfully' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Error updating plate', error: error.message });
        }
    }
};
exports.DVSerialController = DVSerialController;
__decorate([
    (0, common_1.Post)('parse-file'),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)()),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], DVSerialController.prototype, "parseFile", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('dv_plate_number')),
    __param(1, (0, common_1.Query)('serial_number')),
    __param(2, (0, common_1.Query)('batch')),
    __param(3, (0, common_1.Query)('creation_date')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], DVSerialController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('batch-search'),
    __param(0, (0, common_1.Query)('batch')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DVSerialController.prototype, "batchSearch", null);
__decorate([
    (0, common_1.Get)('filter'),
    __param(0, (0, common_1.Query)('creation_date')),
    __param(1, (0, common_1.Query)('insertedAt')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], DVSerialController.prototype, "filter", null);
__decorate([
    (0, common_1.Get)('batches'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DVSerialController.prototype, "getBatches", null);
__decorate([
    (0, common_1.Get)('batch-by-id'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DVSerialController.prototype, "getBatchById", null);
__decorate([
    (0, common_1.Put)('batch-update'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DVSerialController.prototype, "updateBatch", null);
__decorate([
    (0, common_1.Post)('batch-create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DVSerialController.prototype, "createBatch", null);
__decorate([
    (0, common_1.Get)('manufacturers'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DVSerialController.prototype, "getManufacturers", null);
__decorate([
    (0, common_1.Get)('manufacturer-by-id'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DVSerialController.prototype, "getManufacturerById", null);
__decorate([
    (0, common_1.Post)('manufacturer-create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DVSerialController.prototype, "createManufacturer", null);
__decorate([
    (0, common_1.Get)('manufacturer-search'),
    __param(0, (0, common_1.Query)('name')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DVSerialController.prototype, "searchManufacturer", null);
__decorate([
    (0, common_1.Delete)('manufacturer'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DVSerialController.prototype, "deleteManufacturer", null);
__decorate([
    (0, common_1.Put)('dvplates-update'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DVSerialController.prototype, "updatePlate", null);
exports.DVSerialController = DVSerialController = __decorate([
    (0, common_1.Controller)('dv-serial'),
    __metadata("design:paramtypes", [dv_plates_service_1.DVSerialService])
], DVSerialController);
//# sourceMappingURL=dv-plates.controller.js.map