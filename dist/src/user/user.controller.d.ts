import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<{
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
    findOne(id: string, user: User): Promise<{
        role: import(".prisma/client").$Enums.Role;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        image: string;
    }>;
    findOneByEmail(email: string, user: User): Promise<{
        role: import(".prisma/client").$Enums.Role;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        image: string;
    }>;
    update(id: string, updateUserDto: UpdateUserDto, user: User): Promise<{
        role: import(".prisma/client").$Enums.Role;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        image: string;
    }>;
    updateByEmail(email: string, updateUserDto: UpdateUserDto, user: User): Promise<{
        role: import(".prisma/client").$Enums.Role;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        image: string;
    }>;
    remove(id: string, user: User): Promise<{
        message: string;
    }>;
    removeByEmail(email: string, user: User): Promise<{
        message: string;
    }>;
}
