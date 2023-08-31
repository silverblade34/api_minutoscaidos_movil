import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto, RegisterAuthDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { };

    @Get('register')
    registerUser(@Body() registerAuthDto: RegisterAuthDto) {
        return this.authService.registerUser(registerAuthDto);
    }

    @Post('login')
    loginUser(@Body() userObjectLogin: LoginAuthDto) {
        return this.authService.loginUser(userObjectLogin);
    }
}
