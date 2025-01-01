import { Role } from "@prisma/client";
export declare class User {
    id: string;
    name: string;
    email: string;
    emailVerified?: string;
    role: Role;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
