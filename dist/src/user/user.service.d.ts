import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';
import { Role } from '@prisma/client';
export declare class UserService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<{
        role: import(".prisma/client").$Enums.Role;
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        image: string;
    }>;
    findAll(): Promise<{
        role: import(".prisma/client").$Enums.Role;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        image: string;
    }[]>;
    findOne(field: string, value: string, user: User): Promise<{
        role: import(".prisma/client").$Enums.Role;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        image: string;
    }>;
    createUser(name: string, email: string, password: string, role: Role): Promise<{
        role: import(".prisma/client").$Enums.Role;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        password: string;
        image: string | null;
        emailVerified: Date | null;
    }>;
    update(field: string, value: string, dto: UpdateUserDto, user: User): Promise<{
        role: import(".prisma/client").$Enums.Role;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        image: string;
    }>;
    remove(field: string, value: string, user: User): Promise<{
        message: string;
    }>;
    prismaErrorHanler: (error: any, method: string, value?: string) => void;
}
