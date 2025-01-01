import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';
export declare class AuthService {
    private prisma;
    private readonly jwtService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService);
    registerUser(dto: RegisterUserDto): Promise<any>;
    loginUser(email: string, password: string): Promise<any>;
    refreshToken(user: User): Promise<{
        user: User;
        token: string;
    }>;
    private getJwtToken;
}
