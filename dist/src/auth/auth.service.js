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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger('AuthService');
    }
    async registerUser(dto) {
        this.logger.log(`POST: user/register: Register user started`);
        if (dto.password !== dto.passwordconf)
            throw new common_1.BadRequestException('Passwords do not match');
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
            return {
                user: newuser,
                token: this.getJwtToken({
                    id: newuser.id,
                })
            };
        }
        catch (error) {
            if (error.code === 'P2002') {
                this.logger.warn(`POST: auth/register: User already exists: ${dto.email}`);
                throw new common_1.BadRequestException('User already exists');
            }
            this.logger.error(`POST: auth/register: error: ${error}`);
            throw new common_1.InternalServerErrorException('Server error');
        }
    }
    async loginUser(email, password) {
        this.logger.log(`POST: auth/login: Login iniciado: ${email}`);
        let user;
        try {
            user = await this.prisma.user.findUniqueOrThrow({
                where: {
                    email
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                    image: true,
                    role: true,
                    createdAt: true,
                }
            });
        }
        catch (error) {
            this.logger.error(`POST: auth/login: error: ${error}`);
            throw new common_1.BadRequestException('Wrong credentials');
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new common_1.BadRequestException('Wrong credentials');
        }
        delete user.password;
        this.logger.log(`POST: auth/login: Usuario aceptado: ${user.email}`);
        return {
            user,
            token: this.getJwtToken({
                id: user.id,
            })
        };
    }
    async refreshToken(user) {
        return {
            user: user,
            token: this.getJwtToken({ id: user.id })
        };
    }
    getJwtToken(payload) {
        const token = this.jwtService.sign(payload);
        return token;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map