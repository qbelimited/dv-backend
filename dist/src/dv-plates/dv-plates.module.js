"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DvPlatesModule = void 0;
const common_1 = require("@nestjs/common");
const dv_plates_service_1 = require("./dv-plates.service");
const dv_plates_controller_1 = require("./dv-plates.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let DvPlatesModule = class DvPlatesModule {
};
exports.DvPlatesModule = DvPlatesModule;
exports.DvPlatesModule = DvPlatesModule = __decorate([
    (0, common_1.Module)({
        providers: [dv_plates_service_1.DVSerialService],
        controllers: [dv_plates_controller_1.DVSerialController],
        imports: [prisma_module_1.PrismaModule]
    })
], DvPlatesModule);
//# sourceMappingURL=dv-plates.module.js.map