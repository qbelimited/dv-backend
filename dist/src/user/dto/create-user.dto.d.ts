import { Role } from "@prisma/client";
import { RegisterUserDto } from "src/auth/dto/register-user.dto";
export declare class CreateUserDto extends RegisterUserDto {
    role?: Role;
}
