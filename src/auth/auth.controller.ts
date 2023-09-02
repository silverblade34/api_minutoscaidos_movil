import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { };

    @Post('register')
    async registerUser(@Body() registerAuthDto: RegisterAuthDto, @Res() res: Response) {
        const data = await this.authService.registerUser(registerAuthDto);
        res.locals.response('User has been created', data, true)
    }

    @Post('login')
    async loginUser(@Body() userObjectLogin: LoginAuthDto, @Res() res: Response) {
        const data = await this.authService.loginUser(userObjectLogin)
        res.locals.response('User has been found', data, true)
    }
}
