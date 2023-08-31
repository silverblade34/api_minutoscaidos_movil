import { IsNotEmpty } from 'class-validator'

export class LoginAuthDto {
    @IsNotEmpty()
    user: string
    
    @IsNotEmpty()
    password: string
}

export class RegisterAuthDto {
    user: string
    password: string
    rol: string
    status: Boolean
    code: number
    business: string
    name: string
}
