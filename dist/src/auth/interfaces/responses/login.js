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
exports.LoginResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../../user/entities/user.entity");
class LoginResponse {
}
exports.LoginResponse = LoginResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User Data",
        oneOf: [{ $ref: (0, swagger_1.getSchemaPath)(user_entity_1.User) }],
        type: () => user_entity_1.User,
    }),
    __metadata("design:type", user_entity_1.User)
], LoginResponse.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "JWT Token",
        type: "string",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    }),
    __metadata("design:type", String)
], LoginResponse.prototype, "token", void 0);
//# sourceMappingURL=login.js.map