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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const swagger_1 = require("@nestjs/swagger");
class GetServerListeningResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: "ok",
        format: "boolean",
    }),
    __metadata("design:type", Boolean)
], GetServerListeningResponse.prototype, "ok", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "API is working",
        description: "message",
        format: "string",
    }),
    __metadata("design:type", String)
], GetServerListeningResponse.prototype, "message", void 0);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        common_1.Logger.log(`API is working`);
        return { ok: true, message: "API is working" };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Check Server Status',
        description: 'Check the Server is up and running',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ok', type: GetServerListeningResponse }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", GetServerListeningResponse)
], AppController.prototype, "getHello", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('API-Server-Listening'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map