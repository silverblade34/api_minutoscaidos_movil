import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto, RegisterAuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { };

    @Post('register')
    registerUser(@Body() registerAuthDto: RegisterAuthDto) {
        return this.authService.registerUser(registerAuthDto);
    }

    @Post('login')
    loginUser(@Body() userObjectLogin: LoginAuthDto) {
        return this.authService.loginUser(userObjectLogin);
    }
}
