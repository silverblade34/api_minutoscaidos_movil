import { IsNotEmpty } from 'class-validator'

export class LoginAuthDto {
    @IsNotEmpty()
    user: string
    
    @IsNotEmpty()
    password: string
}

