import { HttpException, Injectable } from '@nestjs/common';
import { LoginAuthDto, RegisterAuthDto } from './dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schema/user.schema';
import { Model } from 'mongoose';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModule: Model<UserDocument>,
        private jwtService: JwtService
    ) { }

    async registerUser(registerAuthDto: RegisterAuthDto) {
        // Genera el hash encriptado de la contraseña
        const hashedPassword = await hash(registerAuthDto.password, 10);
        registerAuthDto.password = hashedPassword
        const newUser = new this.userModule(registerAuthDto)
        const createdUser = await newUser.save();
        return createdUser
    }

    async loginUser(userObjectLogin: LoginAuthDto) {
        const { user, password } = userObjectLogin;
        const findUser = await this.userModule.findOne({ user })
        if (!findUser) throw new HttpException('USER_NOT_FOUND', 404);
        const checkPassword = await compare(password, findUser.password);
        if (!checkPassword) throw new HttpException('PASSWORD_INCORRECT', 403);
        const payload = {id:findUser._id, user:findUser.user}
        const token = this.jwtService.sign(payload);
        const data = {
            token,
            user: findUser
        }
        return data;
    }
}
