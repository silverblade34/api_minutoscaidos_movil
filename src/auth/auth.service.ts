import { HttpException, Injectable } from '@nestjs/common';
import { LoginAuthDto, RegisterAuthDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schema/user.schema';
import { Model } from 'mongoose';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModule: Model<UserDocument>,
        private jwtService: JwtService
    ) { }

    async registerUser(registerAuthDto: RegisterAuthDto) {
        return this.userModule.find();
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
