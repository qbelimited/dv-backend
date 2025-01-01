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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../auth/decorators");
const user_entity_1 = require("./entities/user.entity");
const client_1 = require("@prisma/client");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    create(createUserDto) {
        return this.userService.create(createUserDto);
    }
    findAll() {
        return this.userService.findAll();
    }
    findOne(id, user) {
        return this.userService.findOne("id", id, user);
    }
    findOneByEmail(email, user) {
        return this.userService.findOne("email", email, user);
    }
    update(id, updateUserDto, user) {
        return this.userService.update("id", id, updateUserDto, user);
    }
    updateByEmail(email, updateUserDto, user) {
        return this.userService.update("email", email, updateUserDto, user);
    }
    remove(id, user) {
        return this.userService.remove("id", id, user);
    }
    removeByEmail(email, user) {
        return this.userService.remove("email", email, user);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'CREATE USER',
        description: 'Private endpoint to Create a new User. It is allowed only by "admin" users, and allows the creation of users with "admin" Role.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Created', type: user_entity_1.User }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server error' }),
    (0, decorators_1.Auth)(client_1.Role.admin),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'GET ALL USERS',
        description: 'Private endpoint to list all Users. It is allowed only by "admin" users.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ok', type: user_entity_1.User, isArray: true }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server error' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'GET USER BY ID',
        description: 'Private endpoint to get user data by a specific ID. <ul><li>The "user" role is permitted to access only their own information.</li><li>The "admin" role has the privilege to access information of any user</li></ul>'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ok', type: user_entity_1.User }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server error' }),
    (0, decorators_1.Auth)(client_1.Role.admin, client_1.Role.user),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('email/:email'),
    (0, swagger_1.ApiOperation)({
        summary: 'GET USER BY EMAIL',
        description: 'Private endpoint to get user data by Email. <ul><li>The "user" role is permitted to access only their own information.</li><li>The "admin" role has the privilege to access information of any user</li></ul>'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ok', type: user_entity_1.User }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server error' }),
    (0, decorators_1.Auth)(client_1.Role.admin, client_1.Role.user),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findOneByEmail", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'UPDATE USER BY ID',
        description: 'Private endpoint to update user data by Id. <ul><li>The "user" role is permitted to update only their own information.</li><li>The "admin" role has the privilege to update information of any user</li><li>Only the "admin" role can update the "role" field</li></ul>'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ok', type: user_entity_1.User }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server error' }),
    (0, decorators_1.Auth)(client_1.Role.admin, client_1.Role.user),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('email/:email'),
    (0, swagger_1.ApiOperation)({
        summary: 'UPDATE USER BY EMAIL',
        description: 'Private endpoint to update user data by email. <ul><li>The "user" role is permitted to update only their own information.</li><li>The "admin" role has the privilege to update information of any user</li><li>Only the "admin" role can update the "role" field</li></ul>'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ok', type: user_entity_1.User }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server error' }),
    (0, decorators_1.Auth)(client_1.Role.admin, client_1.Role.user),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateByEmail", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'DELETE USER BY ID',
        description: 'Private endpoint to delete user by Id. <ul><li>The "user" role is permitted to remove only their own information.</li><li>The "admin" role has the privilege to delete any user</li></ul>'
    }),
    (0, swagger_1.ApiOkResponse)({ content: { "application/json": { example: { "message": "User deleted" } } } }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server error' }),
    (0, decorators_1.Auth)(client_1.Role.admin, client_1.Role.user),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)('email/:email'),
    (0, swagger_1.ApiOperation)({
        summary: 'DELETE USER BY EMAIL',
        description: 'Private endpoint to delete user by Email. <ul><li>The "user" role is permitted to remove only their own information.</li><li>The "admin" role has the privilege to delete any user</li></ul>'
    }),
    (0, swagger_1.ApiOkResponse)({ content: { "application/json": { example: { "message": "User deleted" } } } }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Server error' }),
    (0, decorators_1.Auth)(client_1.Role.admin, client_1.Role.user),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "removeByEmail", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map