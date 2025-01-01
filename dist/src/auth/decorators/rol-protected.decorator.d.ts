import { Role } from '@prisma/client';
export declare const META_ROLES = "role";
export declare const RolProtected: (...args: Role[]) => import("@nestjs/common").CustomDecorator<string>;
