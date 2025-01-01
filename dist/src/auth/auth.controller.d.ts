import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from 'src/user/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: RegisterUserDto): Promise<any>;
    login(response: any, loginUserDto: LoginUserDto): Promise<void>;
    refreshToken(user: User): Promise<{
        user: User;
        token: string;
    }>;
}
