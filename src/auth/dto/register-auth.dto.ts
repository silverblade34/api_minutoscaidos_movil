import { IsNotEmpty,IsIn } from 'class-validator'

export class RegisterAuthDto {
    @IsNotEmpty()
    user: string

    @IsNotEmpty()
    password: string

    @IsIn(['SOCIO', 'ADMINISTRADOR'])
    rol: string // SOCIO, ADMINISTRADOR

    @IsNotEmpty()
    status: Boolean

    @IsNotEmpty()
    code: string

    @IsNotEmpty()
    business: string

    @IsNotEmpty()
    name: string
}
