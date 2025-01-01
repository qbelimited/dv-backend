"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger('UserService');
        this.prismaErrorHanler = (error, method, value = null) => {
            if (error.code === 'P2002') {
                this.logger.warn(`${method}: User already exists: ${value}`);
                throw new common_1.BadRequestException('User already exists');
            }
            if (error.code === 'P2025') {
                this.logger.warn(`${method}: User not found: ${value}`);
                throw new common_1.BadRequestException('User not found');
            }
        };
    }
    async create(dto) {
        this.logger.log(`POST: user/register: Register user started`);
        if (dto.password !== dto.passwordconf)
            throw new common_1.BadRequestException('Passwords do not match');
        if (dto.role && !client_1.Role[dto.role])
            throw new common_1.BadRequestException('Invalid role');
        dto.email = dto.email.toLowerCase().trim();
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        try {
            const { passwordconf, ...newUserData } = dto;
            newUserData.password = hashedPassword;
            const newuser = await this.prisma.user.create({
                data: newUserData,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    createdAt: true,
                }
            });
            return newuser;
        }
        catch (error) {
            this.prismaErrorHanler(error, "POST", dto.email);
            this.logger.error(`POST: error: ${error}`);
            throw new common_1.InternalServerErrorException('Server error');
        }
    }
    async findAll() {
        try {
            const users = await this.prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });
            return users;
        }
        catch (error) {
            this.logger.error(`GET: error: ${error}`);
            throw new common_1.InternalServerErrorException('Server error');
        }
    }
    async findOne(field, value, user) {
        if (value !== user[field] && user.role !== 'admin')
            throw new common_1.UnauthorizedException('Unauthorized');
        const whereData = field === 'id' ? { id: value } : { email: value };
        try {
            const user = await this.prisma.user.findUniqueOrThrow({
                where: whereData,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });
            return user;
        }
        catch (error) {
            this.prismaErrorHanler(error, "GET", value);
            this.logger.error(`GET/{id}: error: ${error}`);
            throw new common_1.InternalServerErrorException('Server error');
        }
    }
    async createUser(name, email, password, role) {
        try {
            const newUser = await this.prisma.user.create({
                data: {
                    name,
                    email,
                    password,
                    role,
                },
            });
            return newUser;
        }
        catch (error) {
            this.logger.error(`Error creating user: ${error.message || error}`);
            throw new common_1.InternalServerErrorException('Server error');
        }
    }
    async update(field, value, dto, user) {
        if (value !== user[field] && user.role !== 'admin')
            throw new common_1.UnauthorizedException('Unauthorized');
        const whereData = field === 'id' ? { id: value } : { email: value };
        if (user.role !== 'admin')
            delete dto.role;
        const { passwordconf, ...newUserData } = dto;
        if (dto.password) {
            if (dto.password !== passwordconf)
                throw new common_1.BadRequestException('Passwords do not match');
            newUserData.password = await bcrypt.hash(dto.password, 10);
        }
        try {
            const updatedUser = await this.prisma.user.update({
                where: whereData,
                data: newUserData,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });
            return updatedUser;
        }
        catch (error) {
            this.prismaErrorHanler(error, "PATCH", value);
            this.logger.error(`PATCH: error: ${error}`);
            throw new common_1.InternalServerErrorException('Server error');
        }
    }
    async remove(field, value, user) {
        if (value !== user[field] && user.role !== 'admin')
            throw new common_1.UnauthorizedException('Unauthorized');
        const whereData = field === 'id' ? { id: value } : { email: value };
        try {
            const deletedUser = await this.prisma.user.delete({
                where: whereData,
                select: {
                    id: true,
                    email: true,
                    name: true,
                }
            });
            this.logger.warn(`DELETE: ${JSON.stringify(deletedUser)}`);
            return { message: "User deleted" };
        }
        catch (error) {
            this.prismaErrorHanler(error, "DELETE", value);
            this.logger.error(`DELETE: error: ${error}`);
            throw new common_1.InternalServerErrorException('Server error');
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map